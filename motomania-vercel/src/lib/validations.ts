import { z } from 'zod'

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  lastname: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  email: z.string().email('Email inválido'),
  dni: z.string().regex(/^\d{7,9}$/, 'DNI debe ser solo números (7-9 dígitos)'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const LeadSchema = z.object({
  name: z.string().min(1).max(120),
  contact: z.string().min(1).max(180),
  product: z.string().max(220).optional(),
  message: z.string().min(1).max(4000),
  page: z.string().max(255).optional(),
})

export const PointsSchema = z.object({
  dni: z.string().regex(/^\d{7,9}$/),
  points: z.number().int().positive(),
})

export const AdminLoginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
})
