import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {
    }

    getTasks(filterDto :GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({id, userId: user.id});
        if (!found) {
            throw new NotFoundException(`task id=${id} not found`);
        }
        return found;
    }

    async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(dto, user);
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        if (!task) {
            throw new NotFoundException(`task id=${id} is not found`);
        }
        task.status = status;
        return task.save();
    }


    async deleteTaskById(id: number, user: User): Promise<boolean> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if(result.affected === 0) {
            throw new NotFoundException(`Task id=${id} not found.`);
        }
        return true;
    }
}
