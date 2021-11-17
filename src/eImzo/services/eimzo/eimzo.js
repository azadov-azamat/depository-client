/* eslint-disable */
const getX500Val = (s, f) => {
	const res = s.splitKeep(/,[A-Z]+=/g, true);
	for (var i in res) {
		var n = res[i].search(f + "=");
		if (n !== -1) {
			return res[i].slice(n + f.length + 1);
		}
	}
	return "";
};

String.prototype.splitKeep = function (splitter, ahead) {
	var self = this;
	var result = [];
	if (splitter !== "") {
		// Substitution of matched string
		function getSubst(value) {
			var substChar = value[0] === "0" ? "1" : "0";
			var subst = "";
			for (var i = 0; i < value.length; i++) {
				subst += substChar;
			}
			return subst;
		}
		var matches = [];
		// Getting mached value and its index
		var replaceName = splitter instanceof RegExp ? "replace" : "replaceAll";
		var r = self[replaceName](splitter, function (m, i, e) {
			matches.push({
				value: m,
				index: i
			});
			return getSubst(m);
		});
		// Finds split substrings
		var lastIndex = 0;
		for (var i = 0; i < matches.length; i++) {
			var m = matches[i];
			var nextIndex = ahead === true ? m.index : m.index + m.value.length;
			if (nextIndex !== lastIndex) {
				var part = self.substring(lastIndex, nextIndex);
				result.push(part);
				lastIndex = nextIndex;
			}
		}
		if (lastIndex < self.length) {
			var part = self.substring(lastIndex, self.length);
			result.push(part);
		}
	} else {
		result.add(self);
	}
	return result;
};

export const parseData = (data, type) => {
	if (data && data.length > 0) {
		return data.map((item) => {
			var array = [];
			if (type === "pfx") {
				array = item.alias.split(",");
			} else {
				array = item.subjectName.split(",");
			}
			var json = {};
			array.forEach((item) => {
				var parsedItem = item.split("=");
				json[parsedItem[0]] = parsedItem[1];
			});

			if (type === "certkey") {
				var x500name_ex = item.subjectName.toUpperCase();
				x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
				x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
				item.inn = getX500Val(x500name_ex, "INITIALS")
					? getX500Val(x500name_ex, "INITIALS")
					: getX500Val(x500name_ex, "INN")
					? getX500Val(x500name_ex, "INN")
					: getX500Val(x500name_ex, "UID");
				item.serialNumber = getX500Val(item.subjectName.toUpperCase(), "SERIALNUMBER");
			} else {
				var x500name_ex = item.alias.toUpperCase();
				x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
				x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
				item.inn = getX500Val(x500name_ex, "INN") ? getX500Val(x500name_ex, "INN") : getX500Val(x500name_ex, "UID");
				item.serialNumber = getX500Val(item.alias.toUpperCase(), "SERIALNUMBER");
			}

			item.type = type;

			item.parsedAlias = json;

			return item;
		});
	}
	return [];
};
