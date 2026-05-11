import { ThemeProvider } from "@mui/material"
import { customTheme } from "./theme/customeTheme"
import Home from "./customer/pages/Home/Home"
import Products from "./customer/pages/Product/Product"

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      {/* <Home /> */}

      <Products />
    </ThemeProvider>
  )
}

export default App