interface RetrievalDataProps {
    epochMillis: number
    onTripleClick: () => void
}

export const RetrievalDate = ({ epochMillis, onTripleClick } : RetrievalDataProps) => {
    const dateString = new Date(epochMillis).toLocaleString();
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.detail === 3) {
            onTripleClick();
        }
    };
    return (
         <div data-testid="retrieved" className="retrieved" onClick={onClick}>retrieved {dateString}</div>
    );
};