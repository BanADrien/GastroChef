import OrderPanel from '../components/OrderPanel';
// Colonne centrale : commandes
export default function LabOrderPanelWrapper({ orders, onSendDish, dishes }) {
  return <OrderPanel orders={orders} onSendDish={onSendDish} dishes={dishes} />;
}
