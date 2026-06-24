import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import moment from 'moment/moment'

const RecentIncome = ({ transactions, onSseeMore }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income</h5>

                <button className="card-btn" onClick={onSseeMore}>
                    See All <LuArrowRight className='text-base' />
                </button>
            </div>

            <div className="mt-5">
                {transactions?.slice(0, 5)?.map((item) => (
                    <TransactionInfoCard
                        key={item.id}
                        title={item.source}
                        icon={item.icon}
                        date={moment(item.date).format('Do MMM YYYY')}
                        amount={item.amount}
                        type="Income"
                        hideDeleteBtn
                    />
                ))}


            </div>
        </div>
    )
}

export default RecentIncome
