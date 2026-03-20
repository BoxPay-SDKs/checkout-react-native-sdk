declare const styles: {
    card: {
        backgroundColor: string;
        borderRadius: number;
        padding: number;
        marginVertical: number;
        marginHorizontal: number;
        borderWidth: number;
        borderColor: string;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    cardSelected: {
        borderColor: string;
        shadowOpacity: number;
    };
    headerRow: {
        flexDirection: "row";
        justifyContent: "space-between";
        alignItems: "center";
    };
    labelContainer: {
        flexDirection: "row";
        alignItems: "center";
        gap: number;
    };
    labelName: {
        fontSize: number;
        color: string;
        paddingTop: number;
    };
    selectedTag: {
        backgroundColor: string;
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
        marginLeft: number;
        borderColor: string;
        borderWidth: number;
    };
    selectedTagText: {
        fontSize: number;
        color: string;
    };
    addressText: {
        fontSize: number;
        color: string;
    };
    imageStyle: {
        width: number;
        height: number;
    };
};
export default styles;
//# sourceMappingURL=savedAddressCardStyles.d.ts.map