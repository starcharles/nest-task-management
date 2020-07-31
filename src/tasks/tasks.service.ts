import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {
    }

    getTasks(filterDto :GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`task id=${id} not found`);
        }
        return found;
    }

    async createTask(dto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(dto);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        if (!task) {
            throw new NotFoundException(`task id=${id} is not found`);
        }
        task.status = status;
        return task.save();
    }


    async deleteTaskById(id: number): Promise<boolean> {
        const result = await this.taskRepository.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task id=${id} not found.`);
        }
        return true;
    }
}
