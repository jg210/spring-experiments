interface RetrievalDataProps {
    epoch: Date
    onTripleClick: () => void
}

export const RetrievalDate = ({ epoch, onTripleClick } : RetrievalDataProps) => {
    const dateString = epoch.toLocaleString();
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.detail === 3) {
            onTripleClick();
        }
    };
    return (
         <div data-testid="retrieved" className="retrieved" onClick={onClick}>retrieved {dateString}</div>
    );
};