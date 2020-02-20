export const help = {
    overview: {
        text: `<p>Thanks for checking out using Smart Trader! The main purpose of this application is to serve as a demonstrator model for a stock trading web app built with ReactJS with the help of several external services.</p>
        Some of the highlight features of the application are:<br />
        <ul>
        <li>Present a list of stock exechanges around the world</li>
        <li>Retreive a list of symbols in trade at each stock exchange</li>
        <li>Search through a list of symbols by name</li>
        <li>Store certain symbols in a watchlist for convinience</li>
        <li>Present a symbol specific information including a symbol's current, open, high, low prices as well as trend information</li>
        <li>Track the movement of a symbol in real time and plot it on a chart</li>
        <li>Display detailed information about a company, including financial data, ownerships, management and various other metrics</li>
        <li>Let you purchase and sell stocks in a simulated environment</li>
        <li>Keep track of and log your trading history</li>
        <li>Cache key pieces of information about your session so that you can pick up your session from where you last left it off</li>
        <li>Get the latest news headlines from the business world as well as a few other categories</li>
        </ul>
        <br />
        The app presents all the neccessary information through a clean and intuitive UI. Key in-app activities as well as important notifications and other items are strcutured into reports that you can add, remove and arrange the way you like.`, 
        next: 'Basic navigation'
    },

    basicNavigation: {
        text: `<img src="/img/full_view_annotated.png" style="width: 100%" /><br /><br />
        <dl>
        <dt>1. Stock symbols list</dt>
        <dd>Shows a list of symbols traded at the selected exchange. Clicking on an item from the list shows you price information about it and starts a process called <i>symbol tracking</i>. The section "Stocks" explains what it does and how to control it.</dd>

        <dt>2. Watchlist</dt>
        <dd>Shows a list of symbols you've marked as <i>watched</i>.</dd>

        <dt>3. Status bar</dt>
        <dd>An area containing a list of available exchanges, a stock index list, your current balance, button to conduct trading with and application specific buttons.</dd>

        <dt>4. Chart area</dt>
        <dd>At the top, shows the selected symbol's and company's names, current, open, high and low prices and a trend figure. There is also a control button for the tracker. Below that is a chart that displays the selected symbol's price in time.</dd>

        <dt>5. Company info</dt>
        <dd>Displays information for the company identified with the selected symbol.</dd>

        <dt>6. Reports area</dt>
        <dd>Contains various information about trading activity, in-app actions, news and notifications.</dd>
        </dl>`, 
        next: 'Stocks'
    },

    stocksAndCompanies: { text: `<dl>
    <dt>Listing exchanges</dt>
    <dd>A list of available exchanges is automatically put together at application startup. You can view it by clicking on the text to the right of <i>Exchanges:</i> in the status bar. 
    <img src="/img/status_row_with_exchange_selector_annotated.png" class="d-block my-2" style="width: 100%;" />
    Upon selection of an entry, the list of symbols in the left column is automatically updated to reflect the ones available for trade at that exchange.
    </dd>

    <dt>Narrowing down the symbols list</dt>
    <dd>It is common for an exchange to offer tens and thousands of symbols for trade. Listing all of them at the same time significantly degrades app performance. In order to avoid that, only symbols starting with the same letter are displayed. You can control the range of displayed symbols via the selector in the status bar. Just click on the text to the right of <i>Stock Index:</i> and select a character from the list. Upon doing so, the list of stock symbols in the left column will refresh with the ones starting with the selected letter.
    <img src="/img/status_row_with_stock_index_selector_annotated.png" class="d-block my-2" style="width: 100%;" />
    </dd>

    <dt>Finding a symbol</dt>
    <dd>Scroll through the symbols list in the left column titled <i>Market</i> to find the one that you need or click on the magnifying glass to the top right and start typing. The list will get filtered to symbols containing the characters you'd entered. When you find the symbol you're interested in just click on it to start tracking it.<br />
    <img src="/img/symbols_list_annotated.png" class="d-block my-2" style="width: 100%;" />
    </dd>

    <dt>Adding a symbol to your watchlist</dt>
    <dd>You have the ability to add a symbol to the <i>watchlist</i> for easier retrieval later on by just <i>ALt/Option-Clicking</i> it from within the <i>market list</i>. You can filter and browse your <i>watchlist</i> the same way you do the <i>market list</i>.<br />
    <img src="/img/watchlist_highlighted.png" class="d-block my-2" style="width: 100%;" />
    </dd>

    <dt>The symbol tracker</dt>
    <dd>Selecting a symbol from either the <i>market list</i> or a <i>watchlist</i> does two things for you: 

    <p>First, it gets the most recent price values for that symbol and displays them just above the chart. These values include the symbol's current, open, close, highest and lowest prices, as well as a trend calculation as a value/percentage pair.
    </p>
    <p>Second, it starts a process known as <i>Symbol Tracking</i> in order to give you automatic updates on the symbol's parameters. The Symbol Tracking process has two modes of operation: <i>Simulated</i> and <i>Live</i>.
    </p>
    <p>When in <i>Simulated</i> mode, the tracker updates the chart and the symbol's price values with random fake data at set intervals. This mode is designed mainly to demonstrate the functioning of the tracker in an exchange's off hours, when real data is not available.</p> 
    <p>The <i>Live</i> mode enables the tracker to fetch real market data and use it to update the chart. You can tell which mode is currently active by looking at the button above the chart. You can switch between the two modes by <i>Alt/Option-Clicking</i> on that button. You can also Pause/Resume the tracking by simply clicking on the button.</p>
    <img src="/img/tracker_mode_button_annotated.png" class="d-block my-2" style="width: 100%;" />
    </dd>

    <dt>Controlling the chart</dt>
    <dd>You can use the buttons above the chart to zoom in/out, pan and download a snapshot of the chart.
    <img src="/img/chart_controls_highlighted.png" class="d-block my-2" style="width: 100%;" />
    <p>Here's what each button does:<br />
    <img src="/img/zoom_in_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Zoom In on the chart.<br />
    <img src="/img/zoom_out_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Zoom Out on the chart.<br />
    <img src="/img/range_zoom_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Click to enable <i>Range zoom</i>. When enabled, you can click-and-drag a range of the chart to get it zoomed in.<br />
    <img src="/img/pan_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Click to enable <i>Panning</i>. When enabled, you can click-and-drag within the chart to pan it left or right.<br />
    <img src="/img/reset_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Resets the chart to itts initial state in terms of zoom and pan.<br />
    <img src="/img/menu_chart_button.png" class="my-2 mr-2" style="width: 30px" />
    Click to reveal the charts menu. It has options that allow you to download a snapshot of the chart in an <i>SVG</i>, <i>PNG</i> or <i>CSV</i> format.</p>
    </dd>

    <dt>Checking out company info</dt>
    <dd>A company info panel is available to the right of the chart area. Click on the text to the right of <i>Sections:</i> at the top of the panel to choose a section that you're interested in.
    <img src="/img/company_info_highlighted.png" class="my-2" style="width: 100%;" />
    </dd>
    </dl>`, 
    next: 'Trading' },

    trading: { text: `<dl>
    <dt>Buying/Selling</dt>
    <dd>Buying and selling stocks in Smart Trader is pretty simple. Just set the desired amount via the input fields next to the <i>Buy</i> or <i>Sell</i> button depending on what you want to do and then click on the corresponding button. When the process is complete you should see your balance change.
    <p class="text-warning"><br /><i>All trading operations are fictional and are not associated with real money and/or stocks!</i></p>
    <img src="/img/buy_sell_buttons_highlighted.png" class="my-2" style="width: 100%;" /><br />
    After each of your buys or sells a new <i>activity</i> and <i>order</i> records are produced and stored in an archive which you can review in the report boxes below the chart.
    <img src="/img/trading_activity_highlighted.png" class="d-block my-2" style="width: 100%;" />
    </dd>
    </dl>`, 
    next: 'Customizing Your Workspace' },

    workspace: { text: `<dl>
    <dt>Reports</dt>
    <dd>You can add reports containing various information to your workspace through the button to the right of the status bar.<br /><br />
    <img src="/img/report_buttons_highlighted.png" class="d-block my-2" style="width: 100%;" />
    <p>Here's what each button does:<br />
    <img src="/img/order_history_button.png" class="my-2 mr-2" style="width: 30px" />
    Add a report listing all of your orders.<br />
    <img src="/img/activities_button.png" class="my-2 mr-2" style="width: 30px" />
    Add a report listing all the actions you've performed in the application.<br />
    <img src="/img/headlines_button.png" class="my-2 mr-2" style="width: 30px" />
    Add a report listing the latest news headlines.<br />
    <img src="/img/notifications_button.png" class="my-2 mr-2" style="width: 30px" />
    Add a report listing all app notifications.<br />
    <p>All of the report boxes have a menu which you can reveal by clicking the button on the top right of the box. Choosing an item on that menu narrows down the list of displayed items in a report box.</p>
    <img src="/img/report_menu_buttons_highlighted.png" class="d-block my-2" style="width: 100%;" />
    You can also temporarily remove reports that you don't need by clicking the close button at the top right of it.
    <img src="/img/reports_close_buttons_highlighted.png" class="d-block my-2" style="width: 100%;" />
    </p>

    <dt>The Orders Report</dt>
    <dd>The orders report tells you about the trading orders you've made so far. You have the ability to narrow down the list to see only the buys, only the sells or all orders by just clicking the ellipsis button at the top right of the report and choosing an item from the menu. Each row of the table displays the time of the order, the traded symbol, amount, overall price and the type of trade.
    <img src="/img/orders.png" class="d-block my-2" style="width: 25%;" />
    </dd>

    <dt>The Activities Report</dt>
    <dd>The activities report lists actions you've performed using the app. Activities fall in two categories: <i>Application</i> and <i>Trade</i>. <i>Application</i> activities are actions specific to the app like adding or removing reports for example. <i>Trade</i> activities are actions related to trading like buying or selling. You can choose to list activities from a specific category by clicking the ellipsis button at the top right of the report and choosing an item from the menu.
    <img src="/img/activities.png" class="d-block my-2" style="width: 25%;" />
    </dd>

    <dt>The Headlines Report</dt>
    <dd>The headlines report shows you the latest news headlines from around the world. The list is scrollable and lets you click on an item to get to the full story. There are 7 category of news: <i>Business</i>, <i>Entertainment</i>, <i>General</i>, <i>Health</i>, <i>Science</i>, <i>Sports</i>, <i>Technology</i>. You can choose to view headlines from a specific category by clicking the ellipsis button at the top right of the report and choosing an item from the menu.
    <img src="/img/headlines.png" class="d-block my-2" style="width: 25%;" />
    </dd>

    <dt>The Notifications Report</dt>
    <dd>The notifications report shows notifications. There are 3 levels of them: <i>Info</i>, <i>Warning</i> and <i>Error</i>. You can filter the notifications list by clicking the ellipsis button at the top right of the report and choosing an item from the menu.
    <img src="/img/notifications.png" class="d-block my-2" style="width: 25%;" />
    </dd>

    <dt>Repositioning Reports</dt>
    <dd>You can move reports left and right to place them where you need them. To do that pick a report that you want to move, click on its title area. You'll see it gets marked as <i>Selected</i>, which is indicated by the yellow border arund it. Then simply use <i><b>ALt/Option-Left Arrow</b></i> or <i><b>ALt/Option-Right Arrow</b></i> to move it around.
    </dd>
    
    <dt>Getting Help</dt>
    <dd>
    Click on the button at the top right of the  app to show this help window.
    <img src="/img/help_button_highlighted.png" class="d-block my-2" style="width: 100%;" />
    </dd>` }
};