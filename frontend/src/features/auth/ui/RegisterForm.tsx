import { useState, type FormEvent } from 'react';
import { useRegister } from '../model/useRegister';
import { Input, Button, Alert } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '@/shared/types';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error } = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (!fullName.trim()) {
      setValidationError('Full name is required');
      return;
    }

    const user = await register({ 
      email, 
      password,
      full_name: fullName,
      role,
      bio: bio || undefined,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      location: location || undefined,
    });
    
    if (user) {
      onSuccess?.();
      navigate('/login');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert type="error" message={error || validationError} />
      )}
      
      <Input
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          I want to
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="client"
              checked={role === 'client'}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="mr-2"
            />
            Hire freelancers
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="freelancer"
              checked={role === 'freelancer'}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="mr-2"
            />
            Work as a freelancer
          </label>
        </div>
      </div>
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {role === 'freelancer' && (
        <>
          <Input
            label="Bio"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your skills and experience"
          />
          
          <Input
            label="Hourly Rate ($)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="25"
            min="0"
            step="0.01"
          />
        </>
      )}

      <Input
        label="Location (Optional)"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City, Country"
      />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
