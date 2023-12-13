'use strict';

const { Op, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueItems = await this.overdue();
      const overdueString = overdueItems.map(item => item.displayableString()).join("\n");
      console.log(overdueString, "\n");

      console.log("Due Today");
      const dueTodayItems = await this.dueToday();
      const dueTodayString = dueTodayItems.map(item => item.displayableString()).join("\n");
      console.log(dueTodayString, "\n");

      console.log("Due Later");
      const dueLaterItems = await this.dueLater();
      const dueLaterString = dueLaterItems.map(item => item.displayableString()).join("\n");
      console.log(dueLaterString);
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static async markAsComplete(id) {
      return await Todo.update({ completed: true }, {
        where: {
          id: id,
        },
      });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const z = new Date(this.dueDate);
      if (z.getDate() === new Date().getDate()) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }

  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Todo',
  });

  return Todo;
};
