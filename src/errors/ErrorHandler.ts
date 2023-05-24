import { Response } from 'express';
import { AppError, HttpCode } from './AppError';
import { exitHandler } from '../ExitHandler';

class ErrorHandler {
  // 발생한 Error가 신뢰할 수 있는지, 없는지 검사하는 함수
  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleUntrustedError(error, response);
    }
  }

  // 개발자가 발생시킨 AppError인지 검사하는 함수
  // 에러를 발생시키는 지점에서 isOperational
  // 옵션을 추가로 지정하면 서버를 종료 시키는 방향으로 유도할 수 있다.
  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  // 개발자가 발생시킨 에러라면 클라이언트로 메시지와 상태 코드를 전달한다.
  // 클라이언트는 에러 메시지를 보고 뭐가 문제인지 판단가능
  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
  }

  // 개발자가 발생시킨 에러가 아니라면 서버에 예상치 못한
  // 에러가 발생했음을 알리는 상태 코드와 메시지를 클라이언트로 보낸다.
  private handleUntrustedError(
    error: Error | AppError,
    response?: Response
  ): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }

    console.log('Application encountered an untrusted error.');
    console.log(error);
    exitHandler.handleExit(1);
  }
}

export const errorHandler = new ErrorHandler();
