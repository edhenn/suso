/*eslint no-unused-vars: 0*/
var suso = {};

/*global suso */
/*jslint undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

(function (suso) {
	"use strict";

	// amend suso with an EventAware object with three functions to augment passed in objects with observable methods
	suso.EventAware = function (obj) {
		var subscribers = {};

		// .on - registers a callback function to be called when the named event occurs on the object
		obj.on = function (eventName, func) {
			// create a list of subscribers to this event if it doesn't already exist
			if (subscribers[eventName] === undefined) {
				subscribers[eventName] = [];
			}
			// add calling object as a subscriber, along with its function to call on event
			subscribers[eventName].push(func);
			return obj;
		};

		// off allows an object to remove itself from list of events
		obj.off = function (eventName, func) {
			var funcIndex;

			// make sure there is a list of subscribers for this eventName
			if (subscribers[eventName] === undefined) {
				return obj;
			}
			// make sure the callback is a subscriber
			funcIndex = subscribers[eventName].indexOf(func);
			if (funcIndex === -1) {
				return obj;
			}
			// remove subscribed callback from the array
			subscribers[eventName].splice(funcIndex, 1);

			return obj;
		};

		// trigger all functions subscribed to the eventName.
		obj.trigger = function (eventName) {
			var i, sub, subs = subscribers[eventName];
			if (subs === undefined) {
				return obj;
			}
			Array.prototype.splice.call(arguments, 0, 1);
			for (i = 0; i < subs.length; i = i + 1) {
				sub = subs[i];
				if (sub !== undefined && typeof sub === "function") {
					sub.apply(this, arguments);
				}
			}
			return obj;
		};

		return obj;
	};
}(suso));

/*global suso */

(function (suso) {
	"use strict";

	suso.filter = function (obj, fn) {
		var index, result = {};

		if (obj === undefined || typeof obj !== "object") {
			throw new Error("Filter object not specified");
		}

		if (fn === undefined || typeof fn !== "function") {
			throw new Error("Filter function not specified");
		}

		for (index in obj) {
			if (obj.hasOwnProperty(index)) {
				if (fn(obj[index], index)) {
					result[index] = obj[index];
				}
			}
		}

		return result;
	};

	suso.forEach = function (obj, fn) {
		var index, eachResult, result = {};

		if (obj === undefined || typeof obj !== "object") {
			throw new Error("ForEach object not specified");
		}

		if (fn === undefined || typeof fn !== "function") {
			throw new Error("ForEach function not specified");
		}

		for (index in obj) {
			if (obj.hasOwnProperty(index)) {
				eachResult = fn(obj[index], index);
				result[index] = (eachResult || obj[index]);
			}
		}

		return result;
	};
}(suso));

/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	function Grid() {
		var blocks = [],	// 9 blocks of 9 cells each
			cols = [],		// 9 vertical rows of 9 cells each
			rows = [],		// 9 horizontal rows of 9 cells each
			rules,
			i,
			newCell,
			allgroups,
			gridState = "init",
			cellsSolved = 0,
			seedSolved = [],
			me = this;

		function cellUpdated(cell, note) {
			cellsSolved++;
			// only fire a grid update once the grid is ready - not during seeding
			if (gridState === "ready") {
				me.trigger("update", me);
				me.trigger("report", cell, note);
			}
		}

		function setup() {
			// *** CREATE GRID OBJECT ***

			// create 9 blocks, cols, rows
			for (i = 0; i < 9; i++) {
				blocks.push(new suso.House("block", i, me));
				cols.push(new suso.House("col", i, me));
				rows.push(new suso.House("row", i, me));
			}

			// create 81 cells each tied to correct block, vrow, hrow
			for (i = 0; i < 81; i++) {
				newCell = new suso.Cell(me);
				newCell.on("update", cellUpdated);
				newCell.setHouse(rows[Math.floor(i / 9)]);		// every 9 consecutive cells make an hrow
				newCell.setHouse(cols[i % 9]);					// every 9th cell belongs to the same vrow
				newCell.setHouse(blocks[Math.floor(i / 3) % 3 + Math.floor(i / 27) * 3]);	// every 3rd set of 3 consecutive cells up to 9 make a block
			}

			gridState = "unseeded";
		}

		function release() {
			// *** UNSUBSCRIBE ALL GRID EVENTS ***

			// unsubscribe to cell update events
			rows.forEach(function (row) {
				row.cells().forEach(function (cell) {
					cell.off("update", cellUpdated);
					cell.release();
				});
			});

			// release rules
			rules = [];
		}

		this.seedSolved = seedSolved;

		this.state = function () {
			return gridState;
		};

		this.rows = rows;
		this.cols = cols;

		this.vRow = function (index) {
			return cols[index];
		};

		this.hRow = function (index) {
			return rows[index];
		};

		this.block = function (index) {
			return blocks[index];
		};

		this.allGroups = function () {
			if (allgroups === undefined) {
				allgroups = rows.concat(cols).concat(blocks);
			}
			return allgroups;
		};

		this.addSeeds = function (seeds) {
			var row, col, seed;

			if (gridState !== "unseeded") {
				return this;
			}

			for (row = 0; row < seeds.length; row++) {
				for (col = 0; col < seeds[row].length; col++) {
					seed = seeds[row][col];
					if (seed !== undefined && typeof seed === "number") {
						rows[row].cells()[col].setValue(seed);
					}
				}
			}

			gridState = "ready";
			me.trigger("report", me, "grid seeded");
			return this;
		};

		this.solve = function () {
			var rule, progress = true, cell, possVal;

			if (gridState === "complete" || gridState === "incomplete") {
				return this;
			}

			me.trigger("start", me);

			// initial pass to solve for cells with one remaining value after seeding
			for (cell = 0; cell < seedSolved.length; cell++) {
				possVal = seedSolved[cell].possibleValues();
				if (possVal.length === 1) {
					seedSolved[cell].setValue(possVal[0], "one remaining value after seeding");
				}
			}

			// add rules to list - just a default rule for now, allow user to pass in rules later
			rules = [
				suso.rules.lastInGroup,
				suso.rules.restrictedPossibleValue,
				suso.rules.pairs,
				suso.rules.hiddenpairs,
				suso.rules.triples
			];
			// xwing http://www.learn-sudoku.com/x-wing.html
			// ywing http://www.learn-sudoku.com/xy-wing.html (like a naked triple)

			// continually run all rules in the list until a full run causes no progress.
			while (progress && cellsSolved !== 81) {
				progress = false;
				for (rule = 0; rule < rules.length && cellsSolved !== 81; rule++) {
					progress = progress || rules[rule](me);
				}
			}

			gridState = (cellsSolved === 81 ? "complete" : "incomplete");
			me.trigger("report", me, "grid " + gridState);
			me.trigger("finish", me);

			// release resources
			release();

			return this;
		};

		setup();
	}

	suso.Grid = function () {
		return new suso.EventAware(new Grid());
	};
}(suso));

/*global suso */
/*jslint plusplus: true, bitwise: true */
/*eslint plusplus: true, bitwise: true */

(function (suso) {
	"use strict";

	function House(type, num, grid) {
		var cells = [],
			possibles = Math.pow(2, 9) - 1,
			possiblesRemaining = 9,
			that = this;

		function hasPossible(value) {
			var valueFlag = Math.pow(2, 9 - value);
			return (possibles & valueFlag) === valueFlag;
		}

		function updatePossibles(updatedCell) {
			var newValue = updatedCell.value();
			if (hasPossible(newValue)) {
				possibles = possibles ^ Math.pow(2, 9 - newValue);
				possiblesRemaining--;
			} else {
				throw new Error("Attempt to set a Cell to a value not contained in House's possibles list.");
			}
		}

		function cellUpdate() {
			that.trigger("update", this);	// passes solved cell to listeners
			updatePossibles(this);
		}

		this.possibleValues = function () {
			var i, poss = [];
			for (i = 1; i < 10; i++) {
				if (hasPossible(i)) {
					poss.push(i);
				}
			}
			return poss;
		};

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", cellUpdate);
			return that;
		};

		this.grid = function () {
			return grid;
		};

		this.type = function () {
			return type;
		};

		this.num = function () {
			return num;
		};

		this.cells = function () {
			return cells;
		};

		this.name = function () {
			return type + " " + num.toString();
		};

		this.releaseCell = function (cell) {
			cell.off("update", cellUpdate);
		};
	}

	suso.House = function (type, num, grid) {
		return new suso.EventAware(new House(type, num, grid));
	};
}(suso));

/*global suso */
/*jslint plusplus: true, bitwise: true */
/*eslint plusplus: true, bitwise: true */

(function (suso) {
	"use strict";

	var cellnum = 0;

	function Cell(id, grid) {
		var cellId = id, val, myHouses = [],
			houseNums = { "row": 0, "col": 1, "block": 2 },
			possibles = Math.pow(2, 9) - 1,	// bitwise possible values, exponent = (9 - val)
			possibleCount = 9,
			seed = false,
			that = this;

		function updatePossibles(updatedCell) {
			var newValue = updatedCell.value();
			that.removePossible(newValue);
		}

		this.id = function () {
			return cellId;
		};

		this.hasPossible = function (value) {
			var valueFlag = Math.pow(2, 9 - value);
			return (possibles & valueFlag) === valueFlag;
		};

		this.removePossible = function (value) {
			if (that.hasPossible(value)) {
				// remove possible value flag
				possibles = possibles ^ Math.pow(2, 9 - value);
				possibleCount--;
				if (possibleCount === 1) {
					// grid is ready - done seeding. auto-solve cells with one remaining possible value.
					if (grid.state() === "ready") {
						that.setValue(that.possibleValues()[0], "last remaining possible value in cell");
					} else {
						grid.seedSolved.push(that);
					}
				}
				return true;
			}
			return false;
		};

		this.grid = function () {
			return grid;
		};

		this.value = function () {
			return val;
		};

		this.isSeed = function () {
			return seed;
		};

		this.setValue = function (newValue, note) {
			if (val !== undefined) {
				throw new Error("Attempt to set value on a Cell that already has a value.");
			}
			if (grid.state() === "unseeded") {
				seed = true;
			}
			val = newValue;
			possibles = 0;
			possibleCount = 0;
			this.trigger("update", this, note);
		};

		this.setHouse = function (house) {
			var houseNum = houseNums[house.type()];

			if (houseNum === undefined) {
				throw new Error("invalid house");
			}

			if (myHouses[houseNum] !== undefined) {
				throw new Error("Attempt to set " + house.type() + " on a Cell that already has a " + house.type() + ".");
			}

			myHouses[houseNum] = house;
			house.addCell(this);

			// update possible values of the cell when its house is updated
			house.on("update", updatePossibles);
		};

		this.row = function () {
			return myHouses[houseNums.row];
		};

		this.col = function () {
			return myHouses[houseNums.col];
		};

		this.block = function () {
			return myHouses[houseNums.block];
		};

		this.possibleValues = function () {
			var i, poss = [];
			for (i = 1; i < 10; i++) {
				if (that.hasPossible(i)) {
					poss.push(i);
				}
			}
			return poss;
		};

		this.possibleFlags = function () {
			return possibles;
		};

		this.coords = function () {
			if (myHouses[houseNums.row] === undefined || myHouses[houseNums.col] === undefined) {
				return [];
			}
			return [ myHouses[houseNums.row].num(), myHouses[houseNums.col].num() ];
		};

		this.release = function () {
			that.row().off("update", updatePossibles);
			that.row().releaseCell(that);
			that.col().off("update", updatePossibles);
			that.col().releaseCell(that);
			that.block().off("update", updatePossibles);
			that.block().releaseCell(that);
		};
	}

	suso.Cell = function (grid) {
		return new suso.EventAware(new Cell(cellnum++, grid));
	};
}(suso));

/*global suso */
/*jslint plusplus: true, continue: true, bitwise: true */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	// Hidden Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the only instances of two possible remaining values,
	// and removes any other possible values from those 2 cells.
	suso.rules.hiddenpairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			groupnum,
			group,
			cellsByVal,
			cellIndex,
			cell,
			cellValues,
			possIndex,
			safeFlags,
			targetIdx,
			targetFlags,
			flagValue;

		// Iterate through each row, column, and block looking for Hidden Pairs
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			group = allGroups[groupnum];
			cellsByVal = {};
			if (group.possibleValues().length < 3) {
				continue;
			}
			// index cells in group by which possible values they contain
			for (cellIndex = 0; cellIndex < 9; cellIndex++) {
				cell = group.cells()[cellIndex];
				if (cell.value() !== undefined) {
					continue;
				}
				cellValues = cell.possibleValues();
				for (possIndex = 0; possIndex < cellValues.length; possIndex++) {
					if (cellsByVal[cellValues[possIndex]] === undefined) {
						cellsByVal[cellValues[possIndex]] = [];
					}
					cellsByVal[cellValues[possIndex]].push(cell);
				}
			}
			// filter down to possible values existing in exactly 2 cells
			cellsByVal = suso.filter(cellsByVal, function (el) {
				return el.length === 2;
			});
			// for each possible value with 2 cells, check all others for a matching set of cells
			suso.forEach(cellsByVal, function (el, idx) {
				suso.forEach(cellsByVal, function (otherEl, otherIdx) {
					if (otherIdx > idx && el[0] === otherEl[0] && el[1] === otherEl[1]) {
						safeFlags = Math.pow(2, 9 - idx) | Math.pow(2, 9 - otherIdx);	// flags for poss vals to keep
						for (targetIdx = 0; targetIdx < 2; targetIdx++) {
							// remove all other possible values from the cell pair
							targetFlags = el[targetIdx].possibleFlags() ^ safeFlags;	// remaining flags can be removed
							flagValue = 9;
							while (targetFlags > 0) {
								if ((targetFlags & 1) > 0) {
									if (el[targetIdx].removePossible(flagValue)) {
										grid.trigger("report", el[targetIdx], "hidden pairs - remove possible " + flagValue);
										progress = true;
									}
								}
								flagValue--;
								targetFlags = targetFlags >> 1;
							}
						}
					}
				});
			});

		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));

/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	suso.rules.lastInGroup = function (grid) {
		var allgroups = grid.allGroups(),
			groupx,
			groupcells,
			cellx,
			possvalues,
			possx,
			cellsByVal,
			val,
			progress = false;

		// iterate every row, col, and block (listed in allgroups)
		// looking for remaining values that exist in only one cell of the group
		for (groupx = 0; groupx < allgroups.length; groupx++) {
			cellsByVal = {};
			groupcells = allgroups[groupx].cells();

			// iterate cells in group keeping track of all cells indexed by remaining value they contain
			for (cellx = 0; cellx < groupcells.length; cellx++) {
				possvalues = groupcells[cellx].possibleValues();
				for (possx = 0; possx < possvalues.length; possx++) {
					// keep track of this cell by the possible value it contains
					if (cellsByVal[possvalues[possx]] === undefined) {
						cellsByVal[possvalues[possx]] = [];
					}
					cellsByVal[possvalues[possx]].push(groupcells[cellx]);
				}
			}

			// all cells in this group are now indexed by poss value.
			// find each possible value that is in only one cell, and solve the cell
			for (val in cellsByVal) {
				if (cellsByVal.hasOwnProperty(val) &&
						cellsByVal[val].length === 1 &&
						cellsByVal[val][0].value() === undefined) {
					cellsByVal[val][0].setValue(parseInt(val, 10), "last in group - " + allgroups[groupx].name());
					progress = true;
				}
			}
		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));

/*global suso */
/*jslint plusplus: true */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	// Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the same two possible remaining values.
	// The two values can be removed from all other cells in that group.
	suso.rules.pairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			cellnum,
			cell,
			pairs,
			pairindex,
			removal1,
			removal2;

		// Iterate through each row, column, and block looking for pairs ("naked pairs")
		allGroups.forEach(function (group) {
			pairs = {};
			// find all cells with only 2 possible values
			for (cellnum = 0; cellnum < 9; cellnum++) {
				cell = group.cells()[cellnum];
				if (cell.value() === undefined && cell.possibleValues().length === 2) {
					pairindex = cell.possibleValues().join("");
					if (pairs[pairindex] === undefined) {
						pairs[pairindex] = [];
					}
					pairs[pairindex].push(cell);
				}
			}
			// look through the found cells for ones that are pairs (two cells with the same two possible values)
			pairs = suso.filter(pairs, function (paircells) {
				return paircells.length === 2;
			});
			suso.forEach(pairs, function (paircell, pairIdx) {
				var groupProgress = false,
					possVals = pairIdx.split("");
				// delete those possible values from other cells in the group
				group.cells().forEach(function (cel) {
					if (cel !== paircell[0] && cel !== paircell[1]) {
						removal1 = cel.removePossible(parseInt(possVals[0], 10));
						removal2 = cel.removePossible(parseInt(possVals[1], 10));
						groupProgress = groupProgress || removal1 || removal2;
					}
				});
				if (groupProgress) {
					progress = true;
					grid.trigger("report", group,
						"pairs rule - remove possible vals " + possVals + " from " + group.name());
				}
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));

/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	// sometimes called "number claiming" or "omission"
	suso.rules.restrictedPossibleValue = function (grid) {
		var houses = grid.allGroups(),
			intersects,
			blocks,
			rows,
			cols,
			progress = false;

		// iterate every house's remaining values (row, col, block)
		// looking for values that are restricted to one intersecting house
		// (row or col w/ val in one block only; block w/ val in one row or col only)
		// to remove the value from other cells in the intersecting house.
		houses.forEach(function (house) {
			// iterate remaining possible values in this house
			house.possibleValues().forEach(function (possval) {
				intersects = [[], []];	// [blocks, empty] for rows/cols; [rows, cols] for blocks
				// iterate cells in house, looking for possible value restricted to one intersecting house
				house.cells().forEach(function (cell) {
					if (cell.hasPossible(possval)) {
						if (house.type() === "block") {
							rows = intersects[0];
							cols = intersects[1];
							if (rows.indexOf(cell.row()) === -1) {
								rows.push(cell.row());
							}
							if (cols.indexOf(cell.col()) === -1) {
								cols.push(cell.col());
							}
						} else {
							blocks = intersects[0];
							if (blocks.indexOf(cell.block()) === -1) {
								blocks.push(cell.block());
							}
						}
					}
				});
				// if possible value is in only one intersecting house, remove it from other cells of the intersecting house.
				if (house.type() === "block") {
					intersects.filter(function (rowOrCol) {
						return rowOrCol.length === 1;
					}).forEach(function (rowOrCol) {
						rowOrCol[0].cells().forEach(function (intersectCell) {
							if (intersectCell.block() !== house &&
									intersectCell.hasPossible(possval) &&
									intersectCell.removePossible(possval)) {
								progress = true;
								grid.trigger("report", rowOrCol[0],
									"claimed " + possval.toString() + " in " + house.name() +
									" - remove possibles from intersecting " + rowOrCol[0].name());
							}
						});
					});
				} else {
					if (intersects[0].length === 1) {
						intersects[0][0].cells().forEach(function (intersectCell) {
							if (intersectCell.row() !== house &&
									intersectCell.col() !== house &&
									intersectCell.hasPossible(possval) &&
									intersectCell.removePossible(possval)) {
								progress = true;
								grid.trigger("report", intersects[0][0],
									"claimed " + possval.toString() + " in " + house.name() +
									" - remove possibles from intersecting " + intersects[0][0].name());
							}
						});
					}
				}
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));

/*global suso */
/*jslint plusplus: true, bitwise: true, continue: true */

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	// counts number of bits set in flags
	function countBits(flags) {
		var bits = 0;

		if (typeof flags !== "number") {
			return null;
		}

		if (flags <= 0) {
			return 0;
		}

		while (flags > 0) {
			bits += (flags & 1);
			flags = flags >> 1;
		}

		return bits;
	}

	function flagNumbers(flags) {
		var i, nums = [];

		if (typeof flags !== "number") {
			return null;
		}

		if (flags <= 0) {
			return nums;
		}

		for (i = 9; i > 0; i--) {
			if ((flags & 1) === 1) {
				nums.push(i);
			}
			flags = flags >> 1;
		}

		return nums;
	}

	// Triples rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 3 cells containing the same three possible remaining values between them.
	// The three values can be removed from all other cells in that group.
	suso.rules.triples = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			twoOrThreePossibles,
			pairs,
			countPossibles,
			tripletFlags,
			tripletNums,
			numIndex,
			result;

		// Iterate through each row, column, and block looking for triples
		allGroups.forEach(function (group) {
			twoOrThreePossibles = [];
			pairs = [];
			// first, find all pairs of cells in group that share 2 or 3 possible values
			group.cells().filter(function (cell) {
				return cell.value() === undefined;
			}).forEach(function (cell) {
				countPossibles = countBits(cell.possibleFlags());
				if (countPossibles === 2 || countPossibles === 3) {
					// make pairs with all other found cells that share a possible value
					twoOrThreePossibles.forEach(function (twoOrThree) {
						if (twoOrThree.possibleFlags() & cell.possibleFlags() > 0) {
							pairs.push([twoOrThree, cell]);
						}
					});
					twoOrThreePossibles.push(cell);
				}
			});
			// now for each pair, find any triplets that share exactly 3 possible values
			pairs.forEach(function (pair) {
				// test triples with each other candidate cell that had 2 or 3 possible values
				twoOrThreePossibles.forEach(function (cell) {
					if (cell === pair[0] || cell === pair[1]) {
						return;
					}

					tripletFlags = pair[0].possibleFlags() |
						pair[1].possibleFlags() |
						cell.possibleFlags();

					if (countBits(tripletFlags) !== 3) {
						return;
					}

					// remove triplet possible values from all other cells in group
					tripletNums = flagNumbers(tripletFlags);
					group.cells().forEach(function (targetCell) {
						if (targetCell === pair[0] || targetCell === pair[1] || targetCell === cell) {
							return;
						}
						for (numIndex = 0; numIndex < 3; numIndex++) {
							result = result | targetCell.removePossible(tripletNums[numIndex]);
						}
					});

					if (result) {
						result = false;
						progress = true;
						grid.trigger("report", group, "triplet " + tripletNums +
							" in " + group.name() + " - remove other possibles");
					}
				});
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));

/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.InputGrid = function (grid, ctrl) {
		var gridtag,
			gridbody,
			gridrow = "<div class='row'><span class='cell'>{0}</span><span class='cell'>{1}</span><span class='cell'>{2}</span>" +
				"<span class='cell'>{3}</span><span class='cell'>{4}</span><span class='cell'>{5}</span>" +
				"<span class='cell'>{6}</span><span class='cell'>{7}</span><span class='cell'>{8}</span></div>",
			row,
			col,
			styletag,
			styles = ".grid { display: table; border-top: solid 2px black; border-left: solid 2px black; }\n" +
				".row { display: table-row; border-bottom: solid 1px grey; }\n" +
				".row:nth-of-type(3n+0) .cell { border-bottom: solid 2px black; }\n" +
				".cell { width: 38px; height: 40px; display: table-cell; border-style: solid; border-color: grey; border-width: 0 1px 1px 0;" +
				"  text-align: center; vertical-align: middle; font-family: serif; padding-top: 1px; }\n" +
				".cell:nth-of-type(3n+0) { border-right: solid 2px black; }\n" +
				".poss { font-size: 12px; line-height: 12px; float: left; font-family: sans-serif; width: 33%; color: gray; min-height: 12px; }\n" +
				".value { font-size: 22px; font-weight: bold; }\n" +
				".seed { color: tomato; }\n" +
				"#solve { margin: 30px 0; padding: 6px 12px; font-size: 14px; font-weight: 400; " +		// button styles
				"  border: solid 1px #ccc; border-radius: 4px; background-color: #fff; }\n" +			// borrowed from
				"#solve:focus { color: #333; background-color: #e6e6e6; border-color: #8c8c8c; }\n" +	// bootstrap
				"#solve:hover { color: #333; background-color: #e6e6e6; border-color: #adadad; }\n",
			steps = [],
			solvebtn;

		function repl(match, id) {
			var cell = grid.hRow(row).cells()[id],
				val = cell.value(),
				seed = cell.isSeed(),
				possSpans = "",
				possval;

			if (val) {
				return "<span class='value" + (seed ? " seed" : "") + "'>" + val.toString() + "</span>";
			}
			for (possval = 1; possval < 10; possval++) {
				possSpans += "<span class='poss'>" + (cell.hasPossible(possval) ? possval.toString() : "") + "</span>";
			}
			return possSpans;
		}

		function display() {
			gridbody = "";
			for (row = 0; row < 9; row++) {
				gridbody += gridrow.replace(/\{([0-9])\}/g, repl);
				gridbody += "\n";
			}

			// display and refresh both just replace the entire display node with freshly generated results
			gridtag.innerHTML = gridbody;
		}

		function seedGrid() {
			var seeds = [], seedRow, val;
			for (row = 0; row < 9; row++) {
				seedRow = [];
				for (col = 0; col < 9; col++) {
					val = document.getElementById("c" + row.toString() + col.toString()).value;
					seedRow.push(val === "" ? null : parseInt(val, 10));
				}
				seeds.push(seedRow);
			}
			grid.addSeeds(seeds);
		}

		function solveClicked() {
			var solveBtn = document.getElementById("solve");
			solveBtn.removeEventListener("click", solveClicked);
			ctrl.removeChild(solveBtn);
			seedGrid();
			display();
			grid.solve();
		}

		function initialDisplay() {
			gridbody = "";
			for (row = 0; row < 9; row++) {
				gridbody += "<div class='row'>";
				for (col = 0; col < 9; col++) {
					gridbody += "<input id='c" + row.toString() + col.toString() + "'" +
						" class='cell seed value' maxlength='1'" +
						(row === 0 && col === 0 ? " autofocus" : "") +
						"/>";
				}
				gridbody += "</div>";
			}
			gridtag.innerHTML = gridbody;
		}

		this.createStep = function () {
			steps[steps.length] = gridtag.innerHTML;
			return steps.length - 1;
		};

		this.renderStep = function (step) {
			gridtag.innerHTML = steps[step];
		};

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement("div");
			ctrl.setAttribute("id", "Grid-Display");
			document.body.appendChild(ctrl);
		}
		// append styles
		styletag = document.createElement("style");
		ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append grid
		gridtag = document.createElement("div");
		gridtag.setAttribute("class", "grid");
		ctrl.appendChild(gridtag);
		// append controls
		solvebtn = document.createElement("input");
		solvebtn.setAttribute("id", "solve");
		solvebtn.setAttribute("type", "button");
		solvebtn.setAttribute("value", "Solve!");
		ctrl.appendChild(solvebtn);
		solvebtn.addEventListener("click", solveClicked);

		grid.on("update", display);
		grid.on("report", display);

		return initialDisplay();
	};
}(suso));

/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.Preformatted = function (grid, ctrl) {
		var pretag,
			prebody,
			prerow = "{0}{1}{2} {3}{4}{5} {6}{7}{8}",
			row,
			steps = [];

		function repl(match, id) {
			var val = grid.hRow(row).cells()[id].value();
			return val === undefined ? "-" : val.toString();
		}

		function display() {
			prebody = "\n";
			for (row = 0; row < 9; row++) {
				prebody += prerow.replace(/\{([0-9])\}/g, repl);
				prebody += "\n";
				if (row === 2 || row === 5) {
					prebody += "\n";
				}
			}

			// display and refresh both just replace the entire display node with freshly generated results
			pretag.innerHTML = prebody;
		}

		this.createStep = function () {
			steps[steps.length] = pretag.innerHTML;
			return steps.length - 1;
		};

		this.renderStep = function (step) {
			pretag.innerHTML = steps[step];
		};

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement("div");
			ctrl.setAttribute("id", "Grid-Display");
			document.body.appendChild(ctrl);
		}
		pretag = document.createElement("pre");
		ctrl.appendChild(pretag);

		grid.on("update", display);

		return display();
	};
}(suso));

/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.Report = function (settings) {	// grid, ctrl, gridView
		var reportContainer,
			styletag,
			styles = ".report-container { border: solid 2px blue; margin-top: 1em; width: 100%; }\n" +
				".report { border-top: solid 1px grey; margin: 5px; }\n" +
				".title { font-size: 22px; font-weight: bold; margin: 5px; line-height: 1.5em; }",
			ready = false,	// ready indicates the report is complete and can start displaying history
			gridView = settings.gridView;

		function remember() {
			var step;

			if (!ready) {
				return;
			}

			if (this.id.indexOf("step") === 0) {
				step = parseInt(this.id.substring(4), 10);
			}

			if (isNaN(step)) {
				return;
			}

			gridView.renderStep(step);
		}

		function display(reportArg, note) {
			var report;

			// add a node to report container for every call to display
			report = document.createElement("div");
			report.setAttribute("class", "report");
			reportContainer.appendChild(report);

			// if supported, create a step-point in grid-view to remember its state later
			if (gridView !== undefined && gridView.hasOwnProperty("createStep")) {
				report.setAttribute("id", "step" + gridView.createStep());
				report.addEventListener("mouseover", remember);
			}

			if (typeof reportArg === "string") {
				report.innerHTML = reportArg;
			} else if (typeof reportArg === "object" && reportArg.hasOwnProperty("coords")) {	// Cell
				report.innerHTML = "cell action: " +
					reportArg.coords() +
					(reportArg.value() === undefined ? "" : (" = " + reportArg.value().toString())) +
					(note === undefined ? "" : (" -- " + note));
			} else if (typeof reportArg === "object" && reportArg.hasOwnProperty("state")) {	// Grid
				report.innerHTML = note;
				if (reportArg.state() === "complete" || reportArg.state() === "incomplete") {
					ready = true;
				}
			} else {
				report.innerHTML = note;
			}
		}

		this.grid = settings.grid;
		this.ctrl = settings.ctrl;

		// set grid step awareness

		if (this.ctrl === undefined) {
			this.ctrl = document.createElement("div");
			this.ctrl.setAttribute("id", "Report-Display");
			document.body.appendChild(this.ctrl);
		}
		// append styles
		styletag = document.createElement("style");
		this.ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append report container
		reportContainer = document.createElement("div");
		reportContainer.setAttribute("class", "report-container");
		this.ctrl.appendChild(reportContainer);
		reportContainer.innerHTML = "<span id='report-title' class='title'>Report</span>";

		this.grid.on("report", display);

		//return display("grid initialized");
	};
}(suso));

/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.StaticGrid = function (grid, ctrl) {
		var gridtag,
			gridbody,
			gridrow = "<div class='row'><span class='cell'>{0}</span><span class='cell'>{1}</span><span class='cell'>{2}</span>" +
				"<span class='cell'>{3}</span><span class='cell'>{4}</span><span class='cell'>{5}</span>" +
				"<span class='cell'>{6}</span><span class='cell'>{7}</span><span class='cell'>{8}</span></div>",
			row,
			styletag,
			styles = ".grid { display: table; border-top: solid 2px black; border-left: solid 2px black; }\n" +
				".row { display: table-row; border-bottom: solid 1px grey; }\n" +
				".row:nth-of-type(3n+0) .cell { border-bottom: solid 2px black; }\n" +
				".cell { width: 38px; height: 40px; text-align: center; vertical-align: middle; padding-top: 1px;" +
					" display: table-cell; border-right: solid 1px grey; border-bottom: solid 1px grey; }\n" +
				".cell:nth-of-type(3n+0) { border-right: solid 2px black; }\n" +
				".poss { font-size: 12px; line-height: 12px; float: left; font-family: sans-serif; width: 33%; color: gray; min-height: 12px; }\n" +
				".value { font-size: 22px; font-weight: bold; }\n" +
				".seed { color: tomato; }\n",
			steps = [];

		function repl(match, id) {
			var cell = grid.hRow(row).cells()[id],
				val = cell.value(),
				seed = cell.isSeed(),
				possSpans = "",
				possval;

			if (val) {
				return "<span class='value" + (seed ? " seed" : "") + "'>" + val.toString() + "</span>";
			}
			for (possval = 1; possval < 10; possval++) {
				possSpans += "<span class='poss'>" + (cell.hasPossible(possval) ? possval.toString() : "") + "</span>";
			}
			return possSpans;
		}

		function display() {
			gridbody = "";
			for (row = 0; row < 9; row++) {
				gridbody += gridrow.replace(/\{([0-9])\}/g, repl);
				gridbody += "\n";
			}

			// display and refresh both just replace the entire display node with freshly generated results
			gridtag.innerHTML = gridbody;
		}

		this.createStep = function () {
			steps[steps.length] = gridtag.innerHTML;
			return steps.length - 1;
		};

		this.renderStep = function (step) {
			gridtag.innerHTML = steps[step];
		};

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement("div");
			ctrl.setAttribute("id", "Grid-Display");
			document.body.appendChild(ctrl);
		}
		// append styles
		styletag = document.createElement("style");
		ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append grid
		gridtag = document.createElement("div");
		gridtag.setAttribute("class", "grid");
		ctrl.appendChild(gridtag);

		grid.on("update", display);
		grid.on("report", display);

		return display();
	};
}(suso));
