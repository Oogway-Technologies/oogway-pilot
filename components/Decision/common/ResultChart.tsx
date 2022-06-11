import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    LinearScale,
} from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useFormContext, useWatch } from 'react-hook-form'

import { Options } from '../../../utils/types/global'

ChartJS.register(CategoryScale, LinearScale, BarElement)

const options: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        subtitle: {
            display: false,
        },
        title: {
            display: false,
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
                drawBorder: false,
            },
        },
        y: {
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                display: false,
            },
        },
    },
}

export const ResultChart = () => {
    const { control } = useFormContext()
    const optionList: Options[] = useWatch({ name: 'options', control })

    const [data, setData] = useState({
        labels: optionList?.map((item: Options) =>
            item.name.split('').length > 12
                ? `${item.name.substring(0, 12)}...`
                : item.name
        ),
        datasets: [
            {
                label: 'Option',
                data: optionList?.map((item: Options) => item.score),
                backgroundColor: '#C194FF',
                maxBarThickness: 100,
            },
        ],
    })

    useEffect(() => {
        setData({
            labels: optionList?.map((item: Options) =>
                item.name.split('').length > 12
                    ? `${item.name.substring(0, 12)}...`
                    : item.name
            ),
            datasets: [
                {
                    label: 'Option',
                    data: optionList?.map((item: Options) => item.score),
                    backgroundColor: '#C194FF',
                    maxBarThickness: 100,
                },
            ],
        })
    }, [optionList])

    return (
        <div className="flex justify-center items-center w-full">
            <div className="mx-auto w-[80%]">
                <Bar options={options as any} data={data} />
            </div>
        </div>
    )
}
