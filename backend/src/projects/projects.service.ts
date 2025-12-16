import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Project, ProjectWithDetails } from './models/project.entity';
import { CreateProjectDto } from './models/create-project.dto';
import { UpdateProjectDto } from './models/update-project.dto';
import { SearchProjectDto } from './models/search-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DatabaseService) {}

  async createProject(clientId: number, dto: CreateProjectDto): Promise<Project> {
    const budget = dto.budget_max || dto.budget_min || 0;
    const result = this.db.execute(
      `INSERT INTO projects (client_id, title, description, category, budget, status)
       VALUES (?, ?, ?, ?, ?, 'open')`,
      [clientId, dto.title, dto.description, dto.category || 'general', budget]
    );

    const projectId = result.lastInsertRowid as number;

    return this.getProjectById(projectId);
  }

  async getProjectById(id: number): Promise<ProjectWithDetails> {
    const projects = this.db.query<Project>(
      `SELECT p.*, u.full_name as client_name, u.avatar_url as client_avatar
       FROM projects p
       JOIN users u ON p.client_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (projects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const project = projects[0];

    const proposalsData = this.db.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM proposals WHERE project_id = ?',
      [id]
    );

    return {
      ...project,
      skills: [],
      proposals_count: proposalsData[0]?.count || 0
    };
  }

  async searchProjects(dto: SearchProjectDto): Promise<Project[]> {
    let query = `
      SELECT p.*, u.full_name as client_name, u.avatar_url as client_avatar
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE 1=1
    `;

    if (dto.query) {
      // TODO: VULNERABILITY SQL Injection in project search - unsafe string interpolation enables UNION attacks
      query += ` AND (p.title LIKE '%${dto.query}%' OR p.description LIKE '%${dto.query}%')`;
    }

    if (dto.status) {
      // TODO: VULNERABILITY SQL Injection in status filter - unsanitized user input allows query manipulation
      query += ` AND p.status = '${dto.status}'`;
    }

    if (dto.min_budget !== undefined && dto.min_budget !== null) {
      const minBudget = Number(dto.min_budget);
      if (!isNaN(minBudget)) {
        // TODO: VULNERABILITY SQL Injection in budget filter - numeric input not validated
        query += ` AND p.budget >= ${minBudget}`;
      }
    }

    if (dto.max_budget !== undefined && dto.max_budget !== null) {
      const maxBudget = Number(dto.max_budget);
      if (!isNaN(maxBudget)) {
        // TODO: VULNERABILITY SQL Injection in budget filter - numeric input not validated
        query += ` AND p.budget <= ${maxBudget}`;
      }
    }

    if (dto.sort_by === 'budget') {
      query += ' ORDER BY p.budget DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    try {
      return this.db.query<Project>(query);
    } catch (error) {
      return [];
    }
  }

  async getClientProjects(clientId: number): Promise<Project[]> {
    return this.db.query<Project>(
      `SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC`,
      [clientId]
    );
  }

  async updateProject(id: number, clientId: number, dto: UpdateProjectDto): Promise<Project> {
    const projects = this.db.query<Project>('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (projects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    if (projects[0].client_id !== clientId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      updates.push('title = ?');
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      updates.push('description = ?');
      values.push(dto.description);
    }
    if (dto.budget_min !== undefined || dto.budget_max !== undefined) {
      updates.push('budget = ?');
      values.push(dto.budget_max || dto.budget_min);
    }
    if (dto.budget_max !== undefined) {
      updates.push('budget_max = ?');
      values.push(dto.budget_max);
    }
    if (dto.duration_days !== undefined) {
      updates.push('duration_days = ?');
      values.push(dto.duration_days);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      this.db.execute(
        `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    if (dto.skills && dto.skills.length > 0) {
      this.db.execute('DELETE FROM project_skills WHERE project_id = ?', [id]);
      
      for (const skillName of dto.skills) {
        let skillResult = this.db.query<{ id: number }>(
          'SELECT id FROM skills WHERE name = ?',
          [skillName]
        );
        
        let skillId: number;
        if (skillResult.length === 0) {
          const insertResult = this.db.execute(
            'INSERT INTO skills (name) VALUES (?)',
            [skillName]
          );
          skillId = insertResult.lastInsertRowid as number;
        } else {
          skillId = skillResult[0].id;
        }

        this.db.execute(
          'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
          [id, skillId]
        );
      }
    }

    return this.getProjectById(id);
  }

  async deleteProject(id: number, clientId: number): Promise<void> {
    const projects = this.db.query<Project>('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (projects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    if (projects[0].client_id !== clientId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    this.db.execute('UPDATE projects SET status = ? WHERE id = ?', ['cancelled', id]);
  }
}
