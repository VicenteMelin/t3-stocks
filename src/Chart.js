import React from 'react';
import Chart from 'react-google-charts'


function ChartTicker (props){

            return(
                <div>
                    <Chart
                        width={'700px'}
                        height={'400px'}
                        chartType="LineChart"
                        loader={<div>El gráfico se está cargando</div>}
                        data={props.dats}
                        options={{
                        hAxis: {
                            title: 'Tiempo(segundos)',
                        },
                        vAxis: {
                            title: 'Precio(USD)',
                        },
                        }}
                        rootProps={{ 'data-testid': '1' }}
                        />
                </div>
            )
        
}

export default ChartTicker