import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import { PostService } from 'src/post/post.service';
import { ApiFeature } from 'src/utils/apifeature';
import { UpdateCommentDto } from './dto/update.dto';
@Injectable()
export class CommentService {
  selectObject: any;
  constructor(private prisma: PrismaService, private postService: PostService) {
    this.selectObject = JSON.stringify({
      select: {
        id: true,
        content: true,
        parentId: true,
        postId: true,
        users: { select: { id: true, fullname: true, imageCover: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async createCommentForSpecificPost(
    userId: string,
    postId: string,
    content: string,
    parentId?: string,
  ) {
    const findPost = await this.postService.getPostById(postId);
    if (!findPost)
      throw new NotFoundException('post with id ' + postId + ' not found');
    const newComment = await this.prisma.comment.create({
      data: {
        content: content,
        parent: { connect: { id: parentId } },
        posts: { connect: { id: postId } },
        users: { connect: { id: userId } },
      },
      ...JSON.parse(this.selectObject),
    });
    if (!newComment)
      throw new BadRequestException('Something went wrong, try again later');
    return newComment;
  }
  async getNestedComments(parentId: string, data) {
    const getNestedComments = await new ApiFeature(
      this.prisma,
      'comment',
      JSON.parse(this.selectObject),
      { parentId: parentId },
    )
      .search()
      .sort(data.sort)
      .paginate(data.paginate)
      .makeQuery();
    if (getNestedComments.data.length == 0)
      throw new BadRequestException('there are not any nested comments exists');
    return getNestedComments;
  }
  async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentDto,
  ) {
    await this.checkForComment(commentId, userId);
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: data.content },
    });

    return updatedComment;
  }
  async deleteComment(commentId: string, userId: string) {
    await this.checkForComment(commentId, userId);
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async checkForComment(commentId: string, userId: string) {
    const findComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (findComment) {
      if (findComment.userId !== userId)
        throw new BadRequestException(
          'User not the owner of the comment, Cannot update comment',
        );
    } else {
      throw new NotFoundException('Comment with id ' + commentId + 'not exist');
    }
    return findComment;
  }
}
