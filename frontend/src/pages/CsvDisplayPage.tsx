import React, { useEffect, useState } from 'react';
import CsvTable from '../components/CsvTable';
import { parseCSV } from '../utils/csvParser';

const CsvDisplayPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/path/to/your/csv/file.csv'); // Update with actual path
            const text = await response.text();
            const parsedData = parseCSV(text);
            setData(parsedData);
        };

        fetchData();
    }, []);

    return (
        <div className="csv-display-page">
            <h1>CSV Data Display</h1>
            <CsvTable data={data} />
        </div>
    );
};

export default CsvDisplayPage;