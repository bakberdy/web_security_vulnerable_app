import { useEffect, useState, type FormEvent } from 'react'
import { useRegister } from '../model/useRegister'
import { Input, Button, Alert, Stack, Grid, Flex, Text, Radio, useToast } from '@/shared/ui'
import { useNavigate } from 'react-router-dom'
import type { RegisterRole } from '@/shared/types'
import { useAuth } from '@/app/providers/AuthProvider'

type Step = 1 | 2

interface RegisterFormProps {
  onSuccess?: () => void
}

const steps = [
  { id: 1, title: 'Account', description: 'Access and security' },
  { id: 2, title: 'Profile', description: 'Role and details' },
] satisfies Array<{ id: Step; title: string; description: string }>

const roleOptions: Array<{ value: RegisterRole; title: string; description: string }> = [
  { value: 'client', title: 'Client', description: 'Post work, manage orders, and pay securely.' },
  { value: 'freelancer', title: 'Freelancer', description: 'Showcase skills, accept gigs, and get paid.' },
]

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<RegisterRole>('client')
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [location, setLocation] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isTabActive, setIsTabActive] = useState<boolean>(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )
  const { register, isLoading, error } = useRegister()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (error) {
      showToast({ type: 'error', title: 'Registration failed', message: error })
    }
  }, [error, showToast])

  useEffect(() => {
    if (validationError) {
      showToast({ type: 'warning', title: 'Check your input', message: validationError })
    }
  }, [validationError, showToast])

  useEffect(() => {
    function handleVisibilityChange() {
      setIsTabActive(document.visibilityState === 'visible')
    }

    function handleFocus() {
      setIsTabActive(true)
    }

    function handleBlur() {
      setIsTabActive(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  function validateAccount(): string | null {
    if (!fullName.trim()) return 'Full name is required'
    if (!email.trim()) return 'Email is required'
    if (password !== confirmPassword) return 'Passwords do not match'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  function handleNext() {
    const message = validateAccount()
    if (message) {
      setValidationError(message)
      return
    }
    setValidationError('')
    setStep(2)
  }

  async function completeRegistration() {
    if (!isTabActive) {
      setValidationError('Switch to the active tab to finish signing up')
      return
    }

    const user = await register({
      email,
      password,
      full_name: fullName,
      role,
      bio: bio || undefined,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      location: location || undefined,
    })

    if (user) {
      setUser(user)
      onSuccess?.()
      const dashboardPath = user.role === 'freelancer'
        ? '/dashboard/freelancer'
        : '/dashboard/client'
      navigate(dashboardPath, { replace: true })
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (step === 1) {
      handleNext()
      return
    }

    if (!isTabActive) {
      setValidationError('Switch to the active tab to finish signing up')
      return
    }

    const message = validateAccount()
    if (message) {
      setValidationError(message)
      setStep(1)
      return
    }

    setValidationError('')
    await completeRegistration()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Flex gap={3} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        {steps.map((item) => {
          const isActive = step === item.id
          return (
            <div
              key={item.id}
              className={
                `flex-1 rounded-lg border p-3 transition-all ` +
                `${isActive ? 'border-primary-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`
              }
            >
              <Flex align="center" gap={2}>
                <span
                  className={
                    `h-8 w-8 rounded-full flex items-center justify-center font-semibold ` +
                    `${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`
                  }
                >
                  {item.id}
                </span>
                <Stack spacing={1}>
                  <Text weight="semibold">{item.title}</Text>
                  <Text size="sm" color="muted">{item.description}</Text>
                </Stack>
              </Flex>
            </div>
          )
        })}
      </Flex>

      {(error || validationError) && (
        <Alert variant="error">{error || validationError}</Alert>
      )}

      {step === 1 && (
        <Stack spacing={4}>
          <Grid cols={2} gap={4}>
            <Input
              label="Full name"
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
          </Grid>

          <Grid cols={2} gap={4}>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Use a training-safe password"
            />
            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Grid>

          <Text size="sm" color="muted">
            Use throwaway credentials while testing this lab environment.
          </Text>
        </Stack>
      )}

      {step === 2 && (
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Text weight="semibold">Choose your role</Text>
            <Flex gap={3} wrap>
              {roleOptions.map((option) => {
                const isSelected = role === option.value
                return (
                  <div
                    key={option.value}
                    className={
                      `flex-1 min-w-[240px] rounded-lg border p-4 transition ` +
                      `${isSelected ? 'border-primary-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`
                    }
                  >
                    <Flex align="center" justify="between" gap={2}>
                      <Radio
                        name="role"
                        value={option.value}
                        label={option.title}
                        checked={isSelected}
                        onChange={(e) => setRole(e.target.value as RegisterRole)}
                      />
                    </Flex>
                    <Text size="sm" color="muted" className="mt-2">
                      {option.description}
                    </Text>
                  </div>
                )
              })}
            </Flex>
          </Stack>

          {role === 'freelancer' && (
            <Stack spacing={3}>
              <Input
                label="Short bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients about your stack and wins"
              />
              <Grid cols={2} gap={4}>
                <Input
                  label="Hourly rate ($)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="25"
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </Grid>
            </Stack>
          )}

          {role !== 'freelancer' && (
            <Input
              label="Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          )}
        </Stack>
      )}

      <Flex align="center" gap={3} className="pt-2">
        {step === 2 && (
          <Button type="button" variant="ghost" onClick={() => setStep(1)}>
            Back
          </Button>
        )}

        <Button
          type={step === 1 ? 'button' : 'submit'}
          onClick={step === 1 ? handleNext : undefined}
          fullWidth
          className="flex-1"
          disabled={step === 2 ? isLoading : false}
          loading={step === 2 ? isLoading : false}
        >
          {step === 1 ? 'Continue to profile' : isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </Flex>
    </form>
  )
}
