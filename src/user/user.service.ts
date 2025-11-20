import { PrismaService } from "../prisma/prisma.service";
import {  Role } from '@prisma/client';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}


    async getUserById(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                createdAt: true,
                email: true,
                firstName: true,
                lastName: true,
                profilePic: true,
                role: true,
                rating: true,
                products: {
                    select: {
                        id: true,
                        title: true,
                        discountedPrice: true,
                        createdAt: true,
                        category: true,
                        isActive: true,
                        description: true,
                    }
                }
            }
        });
        
        return user;
    }


    async findOne(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                createdAt: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                rating: true,
            }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return user;
    }

    // ...existing code...
    async update(userId: number, updateUserDto: UserDto) {
        
        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: {
              email: updateUserDto.email,
              firstName: updateUserDto.name,
              ...(updateUserDto.role && { role: { set: updateUserDto.role as Role } }),
            },
            select: {
                id: true,
                createdAt: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            }
        });

        return updatedUser;
    }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
        select: {
            id: true,
            createdAt: true,
            email: true,
            firstName: true,
            lastName: true,
            storeName: true,
            profilePic: true,
            role: true,
            rating: true,
            totalRatings: true,
        }
    })
    return users;
  }


}