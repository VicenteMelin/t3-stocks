import React, {useEffect, useState, useCallback} from 'react';
import './App.css';
import ChartTicker from './Chart'
import socketIOClient from 'socket.io-client'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const socket = socketIOClient('wss://le-18262636.bitzonte.com', {
  path: '/stocks'
  })

function App() {

  const [updates,setUpdates] = useState([])
  const [exchanges, setExchanges] = useState([])
  const [stocks, setStocks] = useState([])
  const [buy, setBuy] = useState([])
  const [sell, setSell] =  useState([])
  const [view, setView] = useState('Selecciona una acción')
  const [stamp,setStamp] = useState(0)
  const [dat, setDat] = useState('INFO')
  const [conn, setConn] =useState(true)

  useEffect(() => {
    setStamp(Date.now())
    socket.on('connect', ()=>
    {socket.emit('EXCHANGES')
    socket.emit('STOCKS')})
    
    socket.on('EXCHANGES', (data)=>{ 
      setExchanges(data)
      })
    
    socket.on('STOCKS', (data)=>{ 
      setStocks(data)
      })

    socket.on('UPDATE', (data)=>{ 
      setUpdates(current => [...current, data])
      })

    socket.on('BUY', (data)=>{ 
      setBuy(current => [...current, data])
      })

    socket.on('SELL', (data)=>{ 
      setSell(current => [...current, data])
      })
        }, [])

  const conectar = () => {
    socket.on('connect', ()=> console.log(socket.connected + "in func con"))
    socket.connect()
    setConn(true)
  }

  const desconectar = () => {
    socket.on('disconnect', ()=> console.log(socket.connected + "in func discon"))
    // setStocks([])
    // setExchanges({})
    setConn(false)
    socket.disconnect()
  }

  const Total_buy_stock = (ticker1) => {
    const total = buy
    .filter(({ticker}) => ticker === ticker1)
    .reduce((prevValue, currentValue) => prevValue + currentValue.volume, 0);
    return total;
  };

  const Total_sell_stock = (ticker1) => {
    const total = sell
    .filter(({ticker}) => ticker === ticker1)
    .reduce((prevValue, currentValue) => prevValue + currentValue.volume, 0);
    return total;
  };

  const Max_value = (ticker1) => {
    const total = updates
    .filter(({ticker}) => ticker === ticker1)
    .reduce((max, p) => p.value > max ? p.value : max, 0);
    return total;
  };

  const Min_value = (ticker1) => {
    const total = updates
    .filter(({ticker}) => ticker === ticker1)
    .reduce((min, p) => p.value < min ? p.value : min, Infinity);
    return total;
  };

  const Last_value = (ticker1) => {
    const total = updates.filter(({ticker}) => ticker === ticker1)
    if (total.length > 0) {
      const x = total[total.length - 1]
      return x.value;
    }
    return 0
  };

  const Percentage_value = (ticker1) => {
    const total = updates.filter(({ticker}) => ticker === ticker1)
    if (total.length > 2) {
      const x1 = total[total.length - 1]
      const x2 = total[total.length - 2]
      return ((x2.value - x1.value) * 100/x2.value).toFixed(2);
    }
    return 0
  };

  const Get_ticker = (company_name1) => {
    if (stocks.length > 0) {
      const total = stocks.filter(({company_name}) => company_name === company_name1)
      return total[0].ticker
    }
    return ''
  }

  const Exchange_Buy = (companies) => {
    if (companies.length > 0) {
      const total = companies.reduce((prevValue, currentValue) => prevValue + Total_buy_stock(Get_ticker(currentValue)) , 0);
      return total
    }
    return 0
  }

  const Exchange_Sell = (companies) => {
    if (companies.length > 0) {
      const total = companies.reduce((prevValue, currentValue) => prevValue + Total_sell_stock(Get_ticker(currentValue)) , 0);
      return total
    }
    return 0
  }

  const Total_volume = () => {
    let tot_sell = sell.reduce((prevValue, currentValue) => prevValue + currentValue.volume, 0);
    let tot_buy = buy.reduce((prevValue, currentValue) => prevValue + currentValue.volume, 0);
    return tot_buy + tot_sell
  }

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#173F8A',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  
  
  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 700,
    },
    root: {
      flexGrow: 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
  }));
  
  const classes = useStyles();
  


  return (
    <div>
      <header style={{display: 'flex',  justifyContent:'center', alignItems:'center', backgroundColor:'#173F8A', color:"white"}}>
      <h1> Tarea 3 - Websockets</h1> 

      </header>  
      <nav style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}> 
        <Button style={{margin:20}}  variant="contained" color="primary" onClick={conectar}> conectar</Button> 
        <br/>
        <Button variant="contained" color="secondary"onClick={desconectar}> desconectar </Button> 
      </nav>

  <h2 style={{color:'#173F8A', alignItems:'center', justifyContent:'center', display: 'flex'}}> 
  Estás: {conn? "Conectado/a":"Desconectado/a"}</h2>



      <section >
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>

      <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Accion</InputLabel>
        <Select
          native
          onChange={e => setView(e.target.value)}
        >
        <option value='Selecciona una acción' >Selecciona una acción</option>
        {stocks.map(x => <option value={x.ticker}>{x.ticker}</option>)} 
        </Select>
      </FormControl>
      <br/>
      <br/>
      <br/>

      {view == 'Selecciona una acción'?
      null:
      <div style={{color:'#173F8A'}}>
      <h2 > Estás viendo <br/>el gráfico de: <br/> </h2>
      <h1>{view}</h1>
      </div>
      }
      </div>

      { view == "Selecciona una acción"?
      <ChartTicker dats={[['x', "Selecciona una acción"], [0,0]]} />
      :
      <ChartTicker dats={[['x', view], ...updates.filter(({ticker}) => ticker === view)
      .map(({time, value}) => ([Math.abs(((time - stamp)/1000).toFixed(1)), value]))]} />
      }
      </div>
    </section>


      <section >

      <Paper className={classes.root}>
      <Tabs
        value={dat}
        onChange={(e,x) => setDat(x)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab value="INFO" label="STOCKS INFO" />
        <Tab value="STOCKS" label="STOCK STATS" />
        <Tab value="EXCHANGE" label="EXCHANGE STATS" />
      </Tabs>
      </Paper>


    {
      dat == "INFO"?
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre de <br/> la empresa</StyledTableCell>
            <StyledTableCell align="right">Ticker</StyledTableCell>
            <StyledTableCell align="right">País de origen</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {Object.values(stocks).map(x => 
            <StyledTableRow key={x.company_name}>
              <StyledTableCell component="th" scope="row">{x.company_name} </StyledTableCell>
              <StyledTableCell align="right">{x.ticker}</StyledTableCell>
              <StyledTableCell align="right">{x.country} </StyledTableCell>
            </StyledTableRow>
        )}
        </TableBody>
      </Table>
    </TableContainer>
      :
      dat == "STOCKS"?
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>STOCKS/<br/>DATA</StyledTableCell>
            <StyledTableCell align="right">Volumen Total</StyledTableCell>
            <StyledTableCell align="right">Max Valor</StyledTableCell>
            <StyledTableCell align="right">Min valor</StyledTableCell>
            <StyledTableCell align="right">Último precio</StyledTableCell>
            <StyledTableCell align="right">Variación porcentual</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {stocks.map(x =>
            <StyledTableRow key={x.ticker}>
              <StyledTableCell component="th" scope="row">{x.ticker} </StyledTableCell>
              <StyledTableCell align="right">{Total_buy_stock(x.ticker) + Total_sell_stock(x.ticker)}</StyledTableCell>
              <StyledTableCell align="right">{Max_value(x.ticker)} {x.quote_base} </StyledTableCell>
              <StyledTableCell align="right">{Min_value(x.ticker)} {x.quote_base}</StyledTableCell>
              <StyledTableCell align="right">{Last_value(x.ticker)} {x.quote_base}</StyledTableCell>
              <StyledTableCell align="right">{Percentage_value(x.ticker)} %</StyledTableCell>
            </StyledTableRow>
        )}
        </TableBody>
      </Table>
    </TableContainer>
    :
    <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>EXCHANGES/<br/>DATA</StyledTableCell>
                <StyledTableCell align="right">Volumen <br/>Compra</StyledTableCell>
                <StyledTableCell align="right">Volumen<br/> Venta</StyledTableCell>
                <StyledTableCell align="right">Volumen<br/> Total</StyledTableCell>
                <StyledTableCell align="right">Cantidad <br/>Acciones</StyledTableCell>
                <StyledTableCell align="right">Participación <br/>de Mercado</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {Object.values(exchanges).map(x => 
                <StyledTableRow key={x.exchange_ticker}>
                  <StyledTableCell component="th" scope="row">{x.exchange_ticker} </StyledTableCell>
                  <StyledTableCell align="right">{Exchange_Buy(x.listed_companies)}</StyledTableCell>
                  <StyledTableCell align="right">{Exchange_Sell(x.listed_companies)}</StyledTableCell>
                  <StyledTableCell align="right">{Exchange_Sell(x.listed_companies) + Exchange_Buy(x.listed_companies)}</StyledTableCell>
                  <StyledTableCell align="right">{x.listed_companies.length}</StyledTableCell>
                  <StyledTableCell align="right">{((Exchange_Sell(x.listed_companies) + Exchange_Buy(x.listed_companies))*100/ Total_volume()).toFixed(2)} %</StyledTableCell>
                </StyledTableRow>
                    )} 
            </TableBody>
          </Table>
        </TableContainer>
    }
      
      </section>
    </div>
  );
}

export default App;
