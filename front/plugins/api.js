import AuthService from '@/api/auth'
import DocumentsService from '@/api/documents'
import FoldersService from '@/api/folders'
import NotificationsService from '@/api/notifications'
import PaymentService from '@/api/payment'
import UserService from '@/api/user'
import RenewService from '@/api/renew'

export default function (ctx, inject) {
  const api = {
    auth: new AuthService(ctx),
    documents: new DocumentsService(ctx),
    folders: new FoldersService(ctx),
    notifications: new NotificationsService(ctx),
    payment: new PaymentService(ctx),
    renew: new RenewService(ctx),
    user: new UserService(ctx)
  }

  ctx.$api = api
  inject('api', api)
}
