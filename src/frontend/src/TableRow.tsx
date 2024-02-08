import { RatingPercentage } from "./FSA";

interface TableRowProps {
    ratingPercentage: RatingPercentage;
}

export const TableRow = ({ ratingPercentage }: TableRowProps) => {
    return (
        <tr>
            <td>{ratingPercentage.rating}</td>
            <td>{Math.round(ratingPercentage.percentage)}%</td>
        </tr>
    );
};
