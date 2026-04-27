import { Modal, TouchableOpacity, View } from "react-native";

/**
 * @param {boolean}   visible  - Affiche ou masque le modal
 * @param {function}  onClose  - Appelé quand on ferme (backdrop ou bouton)
 * @param {ReactNode} children - Contenu du modal
 */
export default function Modal({ visible, onClose, children, width, height }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            style={{
                width: width || "60%",
                height: height || "80%",
                borderRadius: 20,
                backgroundColor: "red",
            }}
        >
            {children}
        </Modal>
    );
}
