export class BaseController {
  standardResponse(
    data,
    message = 'Success',
    httpStatus = 200,
  ) {
    return {
      data,
      httpStatus: httpStatus,
      message: message,
    };
  }
}
