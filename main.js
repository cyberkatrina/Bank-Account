const { describe } = require('node:test')

class BankAccount {

  constructor(accountNumber, owner){
    this.accountNumber = accountNumber
    this.owner = owner
    this.transactions = []
  }

  // calculate total balance in account
  balance() {
    let sum = 0
    for (let i = 0; i < this.transactions.length; i++) {
      sum += this.transactions[i].amount
    }
    return sum
  }

  // deposit positive values only
  deposit(amt) {
    if (amt > 0) {
      let newTransaction = new Transaction(amt, this.owner)
      this.transactions.push(newTransaction)
    }
  }

  // charge from balance but do not overdraft account
  charge(payee, amt) {
    let newTransaction1 = new Transaction(amt, payee)
    if (this.balance() - newTransaction1.amount >= 0) {
      newTransaction1.amount = -newTransaction1.amount
      this.transactions.push(newTransaction1)
    }
  }
}

class Transaction {

  constructor(amount, payee) {
    this.amount = amount
    this.payee = payee
    this.date = getDate()
  }
}

// function to get the current date
const getDate = () => {
  const date = new Date();
  let currentDay= String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth()+1).padStart(2,"0");
  let currentYear = date.getFullYear();
  // we will display the date as DD-MM-YYYY 
  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
  return currentDate
}

class SavingsAccount extends BankAccount {

  constructor(accountNumber, owner, interestRate) {
    super(accountNumber, owner)
    this.interestRate = interestRate
  }

  // calculate interest amount
  accrueInterest() {
    let currentBalance = this.balance()
    let interestAmt = currentBalance * this.interestRate
    let interestTransaction = new Transaction(interestAmt, this.owner)
    this.transactions.push(interestTransaction)
  }
}

// tests below 
if (typeof describe === 'function') {
  const assert = require('assert');

  describe("#testing account creation", function(){
    it('should create a new account correctly', function(){
      let acct1 = new BankAccount('xx4432', "James Doe")
      assert.equal(acct1.owner, 'James Doe')
      assert.equal(acct1.accountNumber, 'xx4432')
      assert.equal(acct1.transactions.length, 0)
      assert.equal(acct1.balance(), 0)
    })
  })

  describe("#testing account balance", function(){
    it('should create a new account correctly', function(){
      let acct1 = new BankAccount('xx4432', "James Doe")
      assert.equal(acct1.balance(), 0)
      acct1.deposit(100)
      assert.equal(acct1.balance(), 100)
      acct1.charge("Target", 10)
      assert.equal(acct1.balance(), 90)
    })

    it('should not allow negative deposit', function(){
      let acct1 = new BankAccount('xx4432', "James Doe")
      assert.equal(acct1.balance(), 0)
      acct1.deposit(100)
      assert.equal(acct1.balance(), 100)
      acct1.deposit(-30)
      assert.equal(acct1.balance(), 100)
    })

    it('should not allow charging to overdraft', function(){
      let acct1 = new BankAccount('xx4432', "James Doe")
      assert.equal(acct1.balance(), 0)
      acct1.charge("target", 30)
      assert.equal(acct1.balance(), 0)
    })

    it('should allow a refund', function(){
      let acct1 = new BankAccount('xx4432', "James Doe")
      assert.equal(acct1.balance(), 0)
      acct1.charge("target", -30)
      assert.equal(acct1.balance(), 30)
    })
  })

  describe("#Testing transaction creation", function(){
    it('Should create a transaction correctly for deposit', function(){
      let t1 = new Transaction(30, "Deposit")
      assert.equal(t1.amount, 30)
      assert.equal(t1.payee, "Deposit")
      assert.notEqual(t1.date, undefined)
      assert.notEqual(t1.date, null)
    })

    it('Should create a transaction correctly for a charge', function(){
      let t1 = new Transaction(-34.45, "Target")
      assert.equal(t1.amount, -34.45)
      assert.equal(t1.payee, "Target")
      assert.notEqual(t1.date, undefined)
      assert.notEqual(t1.date, null)
    })
  })

  describe("Savings Account creation", function(){
    it("Create account correctly", function(){
      let saving = new SavingsAccount("xxx1234", "Maddie Mortis", .10)
      assert.equal("xxx1234", saving.accountNumber)
      assert.equal("Maddie Mortis", saving.owner)
      assert.equal(".10", saving.interestRate)
      assert.equal(0, saving.balance())
    })

    it("Accrue interest correctly", function(){
      let saving = new SavingsAccount("xxx1234", "Maddie Mortis", .10)
      assert.equal("xxx1234", saving.accountNumber)
      assert.equal("Maddie Mortis", saving.owner)
      assert.equal(".10", saving.interestRate)
      assert.equal(0, saving.balance())
      saving.deposit(100)
      saving.accrueInterest()
      assert.equal(110, saving.balance())
    })

    it("Accrue interest correctly", function(){
      let saving = new SavingsAccount("xxx1234", "Maddie Mortis", .10)
      saving.deposit(100)
      saving.charge("ATM", 30)
      saving.accrueInterest()
      assert.equal(77, saving.balance())
    })
  })
}