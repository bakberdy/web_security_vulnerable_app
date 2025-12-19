import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class UtilsService {
  private readonly logsDirectory = path.join(process.cwd(), 'public', 'logs');

  async writeLog(filename: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: VULNERABILITY Command injection - unsanitized filename and content passed to shell command enables RCE
      const command = `mkdir -p ${this.logsDirectory} && echo "${content}" > ${this.logsDirectory}/${filename}`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        return {
          success: false,
          message: `Error writing log: ${stderr}`
        };
      }

      return {
        success: true,
        message: `Log written successfully to ${filename}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async readLog(filename: string): Promise<{ success: boolean; content?: string; message?: string }> {
    try {
      // TODO: VULNERABILITY Command injection - unsanitized filename allows arbitrary command execution
      const command = `cat ${this.logsDirectory}/${filename}`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        return {
          success: false,
          message: `Error reading log: ${stderr}`
        };
      }

      return {
        success: true,
        content: stdout
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async listLogs(): Promise<{ success: boolean; files?: string[]; message?: string }> {
    try {
      // TODO: VULNERABILITY Command injection - directory path not sanitized
      const command = `ls -1 ${this.logsDirectory} 2>/dev/null || echo ""`;
      
      const { stdout } = await execAsync(command);
      
      const files = stdout
        .split('\n')
        .filter(f => f.trim() !== '');

      return {
        success: true,
        files
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async executeCommand(command: string): Promise<{ success: boolean; output?: string; message?: string }> {
    try {
      // TODO: VULNERABILITY Command injection - user input directly passed to exec() enables arbitrary command execution and RCE
      const { stdout, stderr } = await execAsync(command);
      
      return {
        success: true,
        output: stdout || stderr
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        output: error.stderr || error.stdout
      };
    }
  }
}
