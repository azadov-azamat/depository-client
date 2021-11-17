import { CAPIWS } from "../../libs/eimzo";
import { parseData } from "./eimzo";

export const startApi = () => {
  CAPIWS.apikey([
    "localhost",
    "96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B",
    "127.0.0.1",
    "A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F",
  ]);
};

export const getAllCertificatesCertkey = () =>
  new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "certkey",
        name: "list_all_certificates",
      },
      (event, data) => {
        resolve(data);
      },
      (error) => {
        reject(error);
      }
    );
  });

export const getAllCertificatesPfx = () =>
  new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "pfx",
        name: "list_all_certificates",
      },
      (event, data) => {
        resolve(data);
      },
      (error) => {
        reject(error);
      }
    );
  });

export const preLoadKey = (vo) =>
  new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "pfx",
        name: "load_key",
        arguments: [vo.disk, vo.path, vo.name, vo.alias],
      },
      (event, data) => {
        if (data.success) {
          resolve(data.keyId);
        } else {
          reject(data.reason);
        }
      }
    );
  });

export const postLoadKey = (id, string) => {
  console.log(id, 6);
  return new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "pkcs7",
        name: "create_pkcs7",
        arguments: [window.Base64.encode(string), id, "no"],
      },
      (event, data) => {
        if (data.success) {
          const pkcs7 = data.pkcs7_64;
          // if (timestamper) {
          // 	const sn = data.signer_serial_number;
          // 	timestamper(data.signature_hex, tst => {
          // 		CAPIWS.callFunction({
          // 			plugin: "pkcs7",
          // 			name: "attach_timestamp_token_pkcs7",
          // 			arguments: [pkcs7, sn, tst]
          // 		},
          // 			(event2, data2) => {
          // 				if (data2.success) {
          // 					const pkcs7tst = data2.pkcs7_64;
          // 					resolve(pkcs7tst);
          // 				} else {
          // 					reject(data2.reason);
          // 				}
          // 			},
          // 			e => {
          // 				reject(e);
          // 			}
          // 		);
          // 	});
          // } else {
          resolve(pkcs7);
          // }
        } else {
          reject(data.reason);
          console.log(data);
        }
      }
    );
  });
};

const postLoadKeyAttach = (id, string) => {
  return new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "pkcs7",
        name: "append_pkcs7_attached",
        arguments: [string, id],
      },
      (event, data) => {
        if (data.success) {
          const pkcs7 = data.pkcs7_64;
          // if (timestamper) {
          // 	const sn = data.signer_serial_number;
          // 	timestamper(data.signature_hex, tst => {
          // 		CAPIWS.callFunction({
          // 			plugin: "pkcs7",
          // 			name: "attach_timestamp_token_pkcs7",
          // 			arguments: [pkcs7, sn, tst]
          // 		},
          // 			(event2, data2) => {
          // 				if (data2.success) {
          // 					const pkcs7tst = data2.pkcs7_64;
          // 					resolve(pkcs7tst);
          // 				} else {
          // 					reject(data2.reason);
          // 				}
          // 			},
          // 			e => {
          // 				reject(e);
          // 			}
          // 		);
          // 	});
          // } else {
          resolve(pkcs7);
          // }
        } else {
          reject(data.reason);
        }
      },
      (e) => {
        reject(e);
      }
    );
  });
};

export const loadPfxKey = (item, string, type) =>
  new Promise((resolve, reject) => {
    CAPIWS.callFunction(
      {
        plugin: "pfx",
        name: "load_key",
        arguments: [item.disk, item.path, item.name, item.alias],
      },
      (event, data) => {
        if (data.success) {
          const id = data.keyId;
          window.sessionStorage.setItem(item.serialNumber, id);
          const func = type === "attach" ? postLoadKeyAttach : postLoadKey;
          func(id, string).then(
            (encryptedString) => {
              resolve(encryptedString);
            },
            (e) => {
              reject(e);
            }
          );
        } else {
          reject(data.reason);
        }
      },
      (e) => {
        reject(e);
      }
    );
  });

export const getSignature = (item, string) =>
  new Promise((resolve, reject) => {
    if (item.type === "certkey") {
      preLoadKey(item).then(
        (id) => {
          postLoadKey(id, string).then(
            (encryptedString) => {
              resolve(encryptedString);
            },
            (error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    } else if (item.type === "pfx") {
      const id = window.sessionStorage.getItem(item.serialNumber);
      if (id) {
        postLoadKey(id, string).then(
          (encryptedString) => {
            resolve(encryptedString);
          },
          () => {
            loadPfxKey(item, string)
              .then((encryptedString) => {
                resolve(encryptedString);
              })
              .catch((e) => {
                reject(e);
              });
          }
        );
      } else {
        loadPfxKey(item, string)
          .then((encryptedString) => {
            resolve(encryptedString);
          })
          .catch((e) => {
            reject(e);
          });
      }
    }
  });

export const getAcceptSignature = (item, data) =>
  new Promise((resolve, reject) => {
    if (item.type === "certkey") {
      preLoadKey(item).then(
        (id) => {
          postLoadKeyAttach(id, data).then(
            (encryptedString) => {
              resolve(encryptedString);
            },
            (error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    } else if (item.type === "pfx") {
      const id = window.sessionStorage.getItem(item.serialNumber);
      if (id) {
        postLoadKeyAttach(id, data).then(
          (encryptedString) => {
            resolve(encryptedString);
          },
          () => {
            loadPfxKey(item, data, "attach");
          }
        );
      } else {
        loadPfxKey(item, data, "attach").then((encryptedString) => {
          resolve(encryptedString);
        });
      }
    }
  });

const parseValidDate = (date) => {
  return new Date(date.split(" ")[0].split(".").join(","));
};

export const sign = async (string, cert) =>
  new Promise(async (resolve, reject) => {
    if (!cert) {
      try {
        cert = await getCertificate().then((res) => res);
      } catch {
        alert("Xatolik yuz berdi!");
        return reject();
      }
    }
    try {
      const signature = await getSignature(cert, string);
      resolve(signature);
    } catch {
      alert("Xatolik yuz berdi!");
      reject();
    }
  });

export const attach = (string) =>
  new Promise(async (resolve, reject) => {
    let cert;
    try {
      cert = await getCertificate().then((res) => res);
    } catch {
      // showAlert("error", i18n.CheckEimzo);
      return reject();
    }
    try {
      const signature = await getAcceptSignature(cert, string);
      resolve(signature);
    } catch {
      // showAlert("error", i18n.PasswordIncorrect);
      reject();
    }
  });

export const getCertificate = () =>
  new Promise(async (resolve, reject) => {
    // const {
    // 	uid,
    // 	serialNumber
    // } = store.getState().auth;
    let allCerts;
    try {
      allCerts = await getAllCertificates();
    } catch {
      return reject();
    }
    // if (serialNumber) {
    // 	resolve(
    // 		allCerts.find(
    // 			cert => cert.inn === uid && cert.serialNumber === serialNumber
    // 		)
    // 	);
    // } else {
    const filteredCerts = allCerts;
    switch (filteredCerts.length) {
      case 0:
        // showAlert("error", i18n.CertNotFound);
        reject();
        break;
      case 1:
        resolve(filteredCerts[0]);
        break;
      default:
        resolve(
          filteredCerts.sort((a, b) =>
            parseValidDate(a.parsedAlias.validto) >
            parseValidDate(b.parsedAlias.validto)
              ? -1
              : 1
          )[0]
        );
    }
    // }
  });

export const getAllCertificates = (uid) =>
  new Promise((resolve, reject) =>
    Promise.all([getAllCertificatesPfx(), getAllCertificatesCertkey()])
      .then((certificates) => {
        const certs = [
          ...parseData(certificates[0].certificates, "pfx"),
          ...parseData(certificates[1].certificates, "certkey"),
        ];
        if (uid) {
          const foundCerts = certs.filter((cert) => cert.inn === uid);
          resolve(foundCerts);
        } else {
          resolve(certs);
        }
      })
      .catch((error) => {
        reject(error);
      })
  );
