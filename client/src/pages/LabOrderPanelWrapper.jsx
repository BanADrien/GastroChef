import OrderPanel from '../components/OrderPanel';
// Colonne centrale : commandes
export default function LabOrderPanelWrapper({ orders, onSendDish, dishes }) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: '10vh',
      zIndex: 900,
      minWidth: 280,
      maxWidth: 340
    }}>
      <OrderPanel orders={orders} onSendDish={onSendDish} dishes={dishes} />
    </div>
  );
}
