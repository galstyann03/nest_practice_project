import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('api/authors')
export class AuthorsController {
    constructor(private readonly authorService: AuthorsService) {}

    @Get()
    findAll() {
        return this.authorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authorService.findOne(id);
    }

    @Post()
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorService.create(createAuthorDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
        return this.authorService.update(id, updateAuthorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.authorService.remove(id);
    }
}
