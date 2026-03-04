import React from "react";

const ModalRechazar = ({
    isOpen,
    onClose,
    onConfirm,
    solicitante,
    observaciones,
    setObservaciones
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="text-reject">✖ Rechazar Solicitud</h3>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p>Solicitante: <strong>{solicitante}</strong></p>

                    <div className="form-group-modal">
                        <label>Motivo del rechazo:</label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Explique por qué se rechaza..."
                            rows="3"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-modal-reject" onClick={onConfirm}>Confirmar Rechazo</button>
                </div>
            </div>
        </div>
    );
};

export default ModalRechazar;