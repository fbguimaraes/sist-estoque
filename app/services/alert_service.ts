/**
 * Service para gerenciar alertas de estoque
 * 
 * @description Lógica de negócio para criar e gerenciar alertas automáticos
 * @author Sistema
 */
import Alert from '#models/alert'
import Product from '#models/product'

export default class AlertService {
  /**
   * Verifica e cria alerta se estoque está abaixo do mínimo
   * 
   * @param {Product} product - Produto a verificar
   * @returns {Promise<Alert | null>} Alerta criado ou null
   */
  static async checkAndCreateAlert(product: Product): Promise<Alert | null> {
    // Verificar se já existe alerta ativo e não lido
    const existingAlert = await Alert.query()
      .where('product_id', product.id)
      .where('is_read', false)
      .first()

    if (existingAlert) {
      return existingAlert
    }

    // Determinar tipo de alerta
    let alertType: 'estoque_baixo' | 'fora_estoque' | 'outro'
    let message: string

    if (product.stockQuantity === 0) {
      alertType = 'fora_estoque'
      message = `Produto "${product.name}" está FORA DE ESTOQUE`
    } else if (product.stockQuantity <= product.minimumStock) {
      alertType = 'estoque_baixo'
      message = `Produto "${product.name}" tem estoque abaixo do mínimo (${product.stockQuantity}/${product.minimumStock})`
    } else {
      return null
    }

    // Criar alerta
    const alert = await Alert.create({
      productId: product.id,
      alertType,
      message,
      isRead: false,
    })

    return alert
  }

  /**
   * Marca alerta como lido
   * 
   * @param {number} alertId - ID do alerta
   * @returns {Promise<Alert>}
   */
  static async markAsRead(alertId: number): Promise<Alert> {
    const alert = await Alert.findOrFail(alertId)
    alert.isRead = true
    await alert.save()
    return alert
  }

  /**
   * Obtém todos os alertas ativos (não lidos)
   * 
   * @returns {Promise<Alert[]>}
   */
  static async getActiveAlerts(): Promise<Alert[]> {
    return await Alert.query().where('is_read', false).preload('product')
  }

  /**
   * Obtém alertas por tipo
   * 
   * @param {string} alertType - Tipo de alerta
   * @returns {Promise<Alert[]>}
   */
  static async getAlertsByType(alertType: string): Promise<Alert[]> {
    return await Alert.query()
      .where('alert_type', alertType)
      .where('is_read', false)
      .preload('product')
  }
}
