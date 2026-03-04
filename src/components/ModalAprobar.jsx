import React from "react";

const ModalAprobar = ({
    isOpen,
    onClose,
    onConfirm,
    solicitante,
    equipo,
    responsable,
    setResponsable,
    prioridad,
    setPrioridad,
    observaciones,
    setObservaciones
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="text-approve">✔ Aprobar Solicitud</h3>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p>Solicitante: <strong>{solicitante}</strong></p>

                    <div className="form-group-modal">
                        <label>Asignar Responsable:</label>
                        <select
                            value={responsable}
                            onChange={(e) => setResponsable(e.target.value)}
                            className="modal-select"
                        >
                            <option value="">Seleccione un integrante...</option>
                            {equipo.map((p) => (
                                <option key={p.id} value={p.nombre}>{p.nombre} - {p.cargo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-modal">
                        <label>Prioridad:</label>
                        <select
                            value={prioridad}
                            onChange={(e) => setPrioridad(e.target.value)}
                            className="modal-select"
                        >
                            <option value="">Seleccione...</option>
                            <option value="Alto">Alto</option>
                            <option value="Medio">Medio</option>
                            <option value="Bajo">Bajo</option>
                        </select>
                    </div>

                    <div className="form-group-modal">
                        <label>Instrucciones adicionales:</label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Escribe aquí..."
                            rows="3"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-modal-approve" onClick={onConfirm}>Confirmar Aprobación</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAprobar;