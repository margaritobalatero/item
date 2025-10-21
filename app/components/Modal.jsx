export default function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button className="button" onClick={onClose}>Close</button>
        </div>
        <div style={{ marginTop:10 }}>{children}</div>
      </div>
    </div>
  );
}