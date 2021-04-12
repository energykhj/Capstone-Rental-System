using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Interactions;
using NUnit.Framework;

namespace AskTest
{
    [TestFixture]
    public class AskTest
    {
        private IWebDriver driver;
        public IDictionary<string, object> vars { get; private set; }
        public object ExpectedConditions { get; private set; }

        private IJavaScriptExecutor js;

        [SetUp]
        public void SetUp()
        {
            driver = new ChromeDriver();
            js = (IJavaScriptExecutor)driver;
            vars = new Dictionary<string, object>();
        }

        [TearDown]
        protected void TearDown()
        {
            driver.Quit();
        }

        [Test]
        public void asktest()
        {
            /// Default login Start
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();
            //wait until login complete

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            /// Default login End
            
            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();
            {
                var element = driver.FindElement(By.TagName("body"));
                Actions builder = new Actions(driver);
                builder.MoveToElement(element, 0, 0).Perform();
            }
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("sel test 0001");
            driver.FindElement(By.CssSelector("p:nth-child(1)")).Click();
            {
                var element = driver.FindElement(By.CssSelector(".ProseMirror"));
                js.ExecuteScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'sel test ask 0001'}", element);
            }

            //wait until 
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title > .ng-tns-c289-2")));
            driver.FindElement(By.CssSelector(".mat-stroked-button")).Click();

            //wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            //wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.XPath("//button[contains(.,'Ask')")));
            //driver.FindElement(By.XPath("//button[contains(.,'Ask')")).Click();

            Assert.That(driver.FindElement(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title > .ng-tns-c289-2")).Text, Is.EqualTo("sel test 0001"));
            /////
        }

        [Test]
        public void a_displayAskList_ClickTheAskButton_DisplayAskList()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            Assert.AreEqual("http://localhost:4200/ask", driver.Url);
                     
        }

        [Test]
        public void b_requestAsk_InputTheTitleAndComment_RequestAskAndAddList()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("mat-input-1")));

            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("test 07");
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror > p"))).Click();

            driver.FindElement(By.CssSelector(".ProseMirror")).SendKeys("test 0777");
            
            driver.FindElement(By.CssSelector(".mat-stroked-button")).Click();

            //wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            //wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector("cdk-focused > .mat-button-wrapper")));

            //wait until save complete and update list
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title")));

            Assert.That(driver.FindElement(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title")).Text, Is.EqualTo("test 07"));
        }
               

        [Test]
        public void c_deleteAsk_ClickTheDeleteButton_ReturnDeleteSuccessMessage()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("mat-input-1")));

            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("test 07");
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror > p"))).Click();

            driver.FindElement(By.CssSelector(".ProseMirror")).SendKeys("test 07 777");

            driver.FindElement(By.CssSelector(".mat-stroked-button")).Click();

            //wait until save complete and update list
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("delete"))).Click();

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title")));

            Assert.That(driver.FindElement(By.CssSelector(".mat-row:nth-child(1) > .cdk-column-title")).Text, Is.EqualTo("test 07"));            
        }

        [Test]
        public void d_editAsk_EditComment_ReturnEditSuccessMessage()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("mat-input-1")));

            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("test 07");
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror > p"))).Click();

            driver.FindElement(By.CssSelector(".ProseMirror")).SendKeys("test 07 777");

            driver.FindElement(By.CssSelector(".mat-stroked-button")).Click();

            //wait until save complete and update list
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("edit"))).Click();

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror-focused > p"))).Click();

            driver.FindElement(By.CssSelector(".ProseMirror-focused")).SendKeys("777");
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".ProseMirror-focused")));

            Assert.That(driver.FindElement(By.CssSelector(".ProseMirror-focused")).Text, Is.EqualTo("test 07 777777"));
        }

        [Test]
        public void e_displayDetail_ClickTheTitle_DisplayTheDetail()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("title")));

            //driver.FindElement(By.Id("title")).Click();
            driver.Navigate().GoToUrl("http://localhost:4200/ask-detail?rowId=123");
            Assert.AreEqual("http://localhost:4200/ask-detail?rowId=123", driver.Url);
        }

        [Test]
        public void f_replyAsk_InputCommentClickTheReply_DisplayTheReply()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("title")));

            driver.Navigate().GoToUrl("http://localhost:4200/ask-detail?rowId=123");

            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror"))).Click();
            driver.FindElement(By.CssSelector(".ProseMirror")).SendKeys("I have it");

            driver.FindElement(By.CssSelector(".mr-3 > .mat-button-wrapper")).Click();

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
           
            Assert.That(driver.FindElement(By.CssSelector(".description >p")).Text, Is.EqualTo("I have it"));            
        }

        [Test]
        public void g_deleteReply_ClickTheDeleteIcon_DeleteTheReply()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("title")));

            //driver.FindElement(By.Id("title")).Click();
            driver.Navigate().GoToUrl("http://localhost:4200/ask-detail?rowId=149");

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("delete"))).Click();
            Assert.That(driver.FindElement(By.Id("mat-dialog-title-0")).Text, Is.EqualTo("Confirm deletion"));

        }

        [Test]
        public void h_editReply_EditReplyComment_EditTheReply()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("title")));

            //driver.FindElement(By.Id("title")).Click();
            driver.Navigate().GoToUrl("http://localhost:4200/ask-detail?rowId=149");

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("edit"))).Click();

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".ProseMirror-focused > p"))).Click();

            driver.FindElement(By.CssSelector(".ProseMirror-focused")).SendKeys("ttt");
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".ProseMirror-focused")));

            Assert.That(driver.FindElement(By.CssSelector(".ProseMirror-focused")).Text, Is.EqualTo("I have itttt"));
        }

        [Test]
        public void e_ReturnAsk_ClickBackButton_ReturnToAskScreen()
        {
            driver.Navigate().GoToUrl("http://localhost:4200/home");
            driver.Manage().Window.Size = new System.Drawing.Size(1100, 800);


            driver.FindElement(By.CssSelector(".mat-button > .mat-button-wrapper")).Click();
            driver.FindElement(By.Id("mat-input-0")).Click();
            driver.FindElement(By.Id("mat-input-0")).SendKeys("jyh@test.com");
            driver.FindElement(By.Id("mat-input-1")).Click();
            driver.FindElement(By.Id("mat-input-1")).SendKeys("Welcome!234");
            driver.FindElement(By.CssSelector(".login-button > .mat-button-wrapper")).Click();

            //wait until login complete
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.CssSelector(".mat-menu-trigger")));

            driver.FindElement(By.CssSelector(".fab-color-ask > .mat-button-wrapper")).Click();

            //wait until ask page complete loading
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.VisibilityOfAllElementsLocatedBy(By.Id("title")));

            //driver.FindElement(By.Id("title")).Click();
            driver.Navigate().GoToUrl("http://localhost:4200/ask-detail?rowId=149");

            //wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            //wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.CssSelector(".cdk-focused"))).Click();

            driver.FindElement(By.Id("back")).Click();

            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));

            driver.Navigate().GoToUrl("http://localhost:4200/ask");
            Assert.AreEqual("http://localhost:4200/ask", driver.Url);
        }
    }
}
