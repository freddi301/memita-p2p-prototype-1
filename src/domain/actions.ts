interface DeriveEquals {}

class Toy implements DeriveEquals {
  constructor(public name: string) {}
}

export class Person implements DeriveEquals {
  isAlive = true;
  hey: boolean;
  constructor(public name: string, public age: number, public toy: Toy) {
    this.hey = true;
  }
}

// new Person("a", 0, new Toy("x")).equals(new Person("a", 0, new Toy("x")));
