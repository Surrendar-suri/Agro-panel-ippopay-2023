import React from "react";
import { Form, Input, Table } from 'antd';

const TableField = ({ column, data, local, current, total, change }) => {
    let locale = {
        emptyText: (
          <span className="empty_data">
            <p>
              Data not found
            </p>
    
          </span>
        )
    
      };
    return (

        <>
            <div className="business_top">
                <div className='agro_card_table'>
                    <div className='card'>
                        <div className='card-body'>
                            <Table
                                align="left"
                                className="gx-table-responsive agri_table"
                                columns={column}
                                dataSource={data}
                                locale={locale}
                                size="middle"
                                pagination={{
                                    current: current,
                                    total: total,
                                    onChange: change,
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
export default TableField;