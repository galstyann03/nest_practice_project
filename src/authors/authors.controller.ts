import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose/dist/pipes/parse-object-id.pipe';

@Controller('api/authors')
@UseGuards(ApiKeyGuard)
export class AuthorsController {
    constructor(private readonly authorService: AuthorsService) {}

    @Get()
    findAll() {
        return this.authorService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id', ParseObjectIdPipe) id: string) {
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
