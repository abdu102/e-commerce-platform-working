import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async list(role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN') {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: number, data: { name: string; email: string }) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email, id: { not: userId } },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already taken');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async changePassword(userId: number, data: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async updateRole(userId: number, role: string) {
    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}


