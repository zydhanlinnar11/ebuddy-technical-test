import { ErrorRequestHandler, Handler } from 'express'

export const notFoundHandler: Handler = async (req, res, next) => {
  res.status(404).json({
    message: 'not_found',
  })
}

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    message: 'internal_server_error',
  })
}

export default errorHandler
