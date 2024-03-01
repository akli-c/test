import { ALBResult } from "aws-lambda";

export class JsonHttpResult {
  private static jsonContentType: { [header: string]: string } = {
    "Content-Type": "application/json",
  };

  /**
   * Return HTTP 200 response with JSON Content-Type.
   * @param body Body of the response
   * @returns HTTP code 200 with JSON Content-Type header
   */
  static ok(body: string): ALBResult {
    return {
      statusCode: 200,
      body: body,
      headers: this.jsonContentType,
    };
  }

  static noContent(): ALBResult {
    return {
      statusCode: 204,
    };
  }

  /**
   * Return HTTP 400 response with JSON Content-Type.
   * @param body Body of the response
   * @returns 400 HTTP error with JSON Content-Type header
   */
  static badRequest(body: string): ALBResult {
    return {
      statusCode: 400,
      body: body,
      headers: this.jsonContentType,
    };
  }

  /**
   * Return HTTP 403 response with JSON Content-Type.
   * @param body Body of the response
   * @returns 403 HTTP error with JSON Content-Type header
   */
  static unauthorized(body: string): ALBResult {
    return {
      statusCode: 403,
      body: body,
      headers: this.jsonContentType,
    };
  }
  /**
   * Return HTTP 404 response with JSON Content-Type.
   * @param body Body of the response
   * @returns 404 HTTP error with JSON Content-Type header
   */
  static notFound(body?: string): ALBResult {
    return {
      statusCode: 404,
      body: body,
      headers: this.jsonContentType,
    };
  }

  /**
   * Return HTTP 500 response with JSON Content-Type.
   * @param body Body of the response
   * @returns 500 HTTP error with JSON Content-Type header
   */
  static internalError(body: string): ALBResult {
    return {
      statusCode: 500,
      body: body,
      headers: this.jsonContentType,
    };
  }
}
