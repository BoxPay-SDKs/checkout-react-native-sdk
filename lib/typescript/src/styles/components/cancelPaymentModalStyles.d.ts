declare const styles: {
    modalContainer: {
        flex: number;
        justifyContent: "center";
        alignItems: "center";
    };
    modal: {
        margin: number;
        backgroundColor: string;
    };
    modalContent: {
        backgroundColor: string;
        borderRadius: number;
        padding: number;
        width: "80%";
        margin: "auto";
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    iconContainer: {
        flexDirection: "row";
        alignItems: "center";
        marginBottom: number;
    };
    iconImage: {
        height: number;
        width: number;
        tintColor: string;
    };
    modalTitle: {
        fontSize: number;
        color: string;
        marginLeft: number;
    };
    modalText: {
        fontSize: number;
        color: string;
        marginBottom: number;
        lineHeight: number;
    };
    buttonContainer: {
        flexDirection: "row";
        justifyContent: "space-between";
        marginTop: number;
    };
    cancelButton: {
        backgroundColor: string;
        paddingVertical: number;
        paddingHorizontal: number;
        flex: number;
        alignItems: "center";
        justifyContent: "center";
    };
    confirmButton: {
        paddingVertical: number;
        paddingHorizontal: number;
        flex: number;
        marginLeft: number;
        alignItems: "center";
        justifyContent: "center";
    };
    buttonText: {
        color: string;
        fontSize: number;
        textAlign: "center";
    };
    confirmButtonText: {
        color: string;
        fontSize: number;
        textAlign: "center";
    };
};
export default styles;
//# sourceMappingURL=cancelPaymentModalStyles.d.ts.map