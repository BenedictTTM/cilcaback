import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

function humanFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${size} ${sizes[i]}`;
}

@Catch()
export class FileSizeExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // If it's a Nest HttpException we'll inspect the message
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();

      // Normalize message string
      const message = typeof resBody === 'string' ? resBody : (resBody as any)?.message || (resBody as any)?.error || JSON.stringify(resBody);

      // Detect ParseFilePipe / MaxFileSizeValidator pattern
      // Examples we want to transform:
      // "Validation failed (current file size is 8008329, expected size is less than 5242880)"
      const fileSizeMatch = /current file size is (\d+), expected size is less than (\d+)/i.exec(message);
      if (fileSizeMatch) {
        try {
          const current = parseInt(fileSizeMatch[1], 10);
          const max = parseInt(fileSizeMatch[2], 10);
          const friendly = `Uploaded file is too large. Maximum allowed is ${humanFileSize(max)}; your file is ${humanFileSize(current)}.`;
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: friendly,
            path: request.url,
          });
        } catch (err) {
          // fallback to default
        }
      }

      // If no specific match, pass through original exception body
      return response.status(status).json(resBody);
    }

    if (exception instanceof Error && exception.message && exception.message.includes('Not allowed by CORS')) {
      return response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: 'CORS policy does not allow access from this origin',
        path: request.url,
      });
    }

    // Not an HttpException: default internal server error
    console.error('Non-http exception caught by FileSizeExceptionFilter:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      path: request.url,
    });
  }
}
