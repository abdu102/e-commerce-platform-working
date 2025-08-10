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
    // Remove dependent records first to satisfy FK constraints
    await this.prisma.$transaction([
      // Order items belonging to user's orders
      this.prisma.orderItem.deleteMany({ where: { order: { userId } } }),
      // Orders
      this.prisma.order.deleteMany({ where: { userId } }),
      // Cart items
      this.prisma.cartItem.deleteMany({ where: { userId } }),
      // Wishlist
      this.prisma.wishlistItem.deleteMany({ where: { userId } }),
      // Reviews
      this.prisma.review.deleteMany({ where: { userId } }),
      // Q&A
      this.prisma.answer.deleteMany({ where: { userId } }),
      this.prisma.question.deleteMany({ where: { userId } }),
    ]);
    return this.prisma.user.delete({ where: { id: userId } });
  }

  async adminUpdateUser(userId: number, data: { name?: string; email?: string; password?: string }) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) {
      const exists = await this.prisma.user.findFirst({ where: { email: data.email, id: { not: userId } } });
      if (exists) throw new BadRequestException('Email is already taken');
      updateData.email = data.email;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true }
    });
  }
}


