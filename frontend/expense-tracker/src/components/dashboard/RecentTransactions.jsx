import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../cards/TransactionInfoCard';

const RecentTransactions = ({ transactions, onSesMore }) => {
    return (
        <div className='card'>
            <div className="flex items-center justify-between">
                <h6 className="text-lg">Recent transaction</h6>
                <button className='card-btn' onClick={onSesMore}>
                    See All <LuArrowRight className='text-base' />
                </button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.type == 'Expense' ? item.category : item.source}
                        icon={item.icon}
                        date={moment(item.date).format('DD MM YYYY')}
                        amount={item.amount}
                        type={item.type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions
