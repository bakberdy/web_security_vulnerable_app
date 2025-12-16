export interface UserEntity {
    id: number;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
}
