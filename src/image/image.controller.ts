import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Image } from './entities/image.entity';

@Controller('image')
@ApiTags('images of meals 🍴')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image' })
  @ApiResponse({ status: 201, description: 'Image created', type: Image })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({
    status: 200,
    description: 'List of images',
    type: [Image],
  })
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Image found', type: Image })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an image' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Image updated', type: Image })
  @ApiResponse({ status: 404, description: 'Image not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Image deleted' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.imageService.remove(+id);
  }
}
