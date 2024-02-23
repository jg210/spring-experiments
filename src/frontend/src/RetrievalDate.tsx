interface RetrievalDataProps {
    epochMillis: number
}

export const RetrievalDate = ({epochMillis} : RetrievalDataProps) => {
    const dateString = new Date(epochMillis).toLocaleString();
    return (
         <div data-testid="retrieved" className="retrieved">retrieved {dateString}</div>
    );
};