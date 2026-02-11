import React from 'react';

interface CsvTableProps {
    data: any[];
}

const CsvTable: React.FC<CsvTableProps> = ({ data }) => {
    if (!data.length) return (
        <div className="text-center py-8">
            <p className="text-gray-500">No data available</p>
        </div>
    );

    const headers = Object.keys(data[0]);

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {headers.map((header) => (
                            <th 
                                key={header} 
                                className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr 
                            key={index} 
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                            {headers.map((header) => (
                                <td 
                                    key={header} 
                                    className="px-6 py-4 text-gray-700"
                                >
                                    {row[header] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CsvTable;