TEAM YumBums:
- Amr Kahhaleh
- Jacob Keifer
- John Wishon
- Peter Yao
- Zarni Wang

CSE 134B - HW3
_______________________________

Since we weren’t aloud to heavily rely on existing frameworks and use a lot of JavaScript, we had to hard-code the positions of many of our elements and include rules to change their sizes based on screen size. Here are some examples:

• Across the whole app, we divided the the page into a grid of thirds for all mid/big screen sizes, and a (1 fifth- 3 fifths - 1 fifth) grid for smaller screens.   
• On the landing “index.html” page, we made the font 2em for all mid/big screen sizes, and 1.5 em on smaller screens
• On the “habits.html” page, many elements are given fixed padding 
• We included some customized fonts that look good on Chrome and Safari like ‘Helvetica’ and ‘Architects Daughters’ but we also made all fonts fall to ‘Sans Serif’ which is flat and would still look okay on all browsers if they don’t support the other font families. 


Since the goal of this assignment is “to implement a ‘clickable’ high fidelity version of the screens given to us that mocks basic flow using CSS and HTML“, we added some duplicated pages that only have slight changes from their original page. With the limited time/resources we have for this assignment, this approach made a lot of sense rather than implementing a 100% fully functional application. Here’s a list of these types of hacks:

• On the habits page: clicking on any of the thumbs buttons would navigated to a duplicated “progress-hack.html” page that replace the top habit’s thumbs buttons with the progress bar. 
• On the habits page: clicking on any of the three dotted (…) buttons would navigated to a duplicated “habits-options.html” page that moves the content of the first habit to the left and shows extra (edit and delete) buttons. In the real application, we could use JS to make the animation effect for the content sliding and the options buttons showing up. In this case we’re just loading a new page with the end result. Regardless of which (…) button is pressed, we only show the options for the first habit.
• On the habits-options page: clicking on the edit page takes you to the same “edit page” for the “Recycle cans” habit. Clicking on the delete button would only delete the top habit, since we’re only showing extra options for the top habit.  

Final remarks:
• The application loads with pre-populated entries of habits that can’t actually be edited. Only the top habit can be removed.
• Adding a new event and hitting save wouldn’t really save it. It would just take the user back to the habits page.
• Editing an existing event and hitting save wouldn’t really save it. It would just take the user back to the habits page.
 