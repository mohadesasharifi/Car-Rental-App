import * as React from 'react';
import Pagination from "@mui/material/Pagination";
import Stack from '@mui/material/Stack';
interface PaginationComponentProps {
    count: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}
const PaginationComponent: React.FC<PaginationComponentProps> = ({ count, currentPage, onPageChange }) => {
    return (
        <div className="pagination-container">
            <Stack spacing={2}>
                <Pagination
                    count={count}
                    page={currentPage}
                    onChange={onPageChange}
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </div>
            );
            };
            export default PaginationComponent;

