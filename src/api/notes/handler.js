const ClientError = require('../../exceptions/ClientError')

class NotesHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.errorHandler = this.errorHandler.bind(this)

    this.postNoteHandler = this.postNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)
  }

  errorHandler (request, h, error) {
    // CLIENT ERROR
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message
      })
      response.code(error.statusCode)
      return response
    }

    // SERVER ERROR
    const response = h.response({
      status: 'fail',
      message: 'Maaf, terjadi kegagalan pada server kami.'
    })
    response.code(500)
    console.log(error)
    return response
  }

  postNoteHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { title = 'untitled', tags, body } = request.payload
      const noteId = this._service.addNote({ title, tags, body })

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return this.errorHandler(request, h, error)
    }
  }

  getNotesHandler (request, h) {
    const notes = this._service.getNotes()
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        notes
      }
    })
    response.code(200)
    return response
  }

  getNoteByIdHandler (request, h) {
    const { id } = request.params
    try {
      const note = this._service.getNoteById(id)
      const response = h.response({
        status: 'success',
        data: {
          note
        }
      })
      response.code(200)
      return response
    } catch (error) {
      return this.errorHandler(request, h, error)
    }
  }

  putNoteByIdHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)

      const { id } = request.params
      this._service.editNoteById(id, request.payload)

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui'
      }
    } catch (error) {
      return this.errorHandler(request, h, error)
    }
  }

  deleteNoteByIdHandler (request, h) {
    const { id } = request.params
    try {
      this._service.deleteNoteById(id)
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus'
      })
      response.code(200)
      return response
    } catch (error) {
      return this.errorHandler(request, h, error)
    }
  }
}

module.exports = NotesHandler
