/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { PemParser } from './pem-parser.class';

describe( 'PEM Parser', () => {

	const privateKeyBase64: string = `-----BEGIN RSA PRIVATE KEY-----
MIIJQQIBADANBgkqhkiG9w0BAQEFAASCCSswggknAgEAAoICAQCr1MNdqyoXB/vb1dKYhETf7mEOIVW48xNBSy9dWWcgnd66R7P9vJ0A1X7bkvtFX++5lMHDEN7PcmJwscb0XQvpJrXDaZrH3cIdP4r+PPfWlR+RP74U4+XlrMfreAxK8r7Lhq/w0mHgYfNJTeSm1rwJAYDGnYb1uYY2ISpZZ69iGbWYzKPk0ySZiUZMsdUAsb56Nz/6FJxnVgy6MhgrsLOzsvCBfZJLtmTD0YVUOzwPlvLzKpdjlpEgRaYB+Y27irX+Zv0NXaLNSQsHnnBvVMKefkDVdJaCLIJLkzKhwBGoBqaB74+i/hT2w6ummXgJGYsJwAef38tjiILb6ltPHbqoBJHrM2b18a43SsOTGVTO0xHDIDi9/4hKS72LU/YzyGGHf338eOBHpoVtedn07rh/mD7h1HK0ktBPZ0MmFSLWQH+lyWcYBzlo49fdIho3pU4D6YjXyk0Vbzq3SEJ1ZfN10T0cWFVV0FUu3bIXTKJpPi1LtxMmUt7KPedYEj2Xvp2FCYmLVLEo0R+iz+d5IE5YQIcKjWBmu4H81Lwly1lMHTvn1qxTozao7aiWH1tOo0xJOBlqbrttrzeRoWkNDqslKzkryCPuG1rA9oxGYpMEHyrIq6JA3CkVVEc4LGY4GLCu8o14RXpZumGnO40ON2OuK6a/igs2Bd1vVB9L5Qz9EQIDAQABAoICABu6//ZvZ6EE5FQDi3OasQTUkyw1HAD3lY1thUzS305HvAijBry1wj6+tbTY4R0+kNEJ3UVORS8EXjeisSGBnKj5Ws8ZDWYg9zFCLnu+Oh8SvN/zggkcCF+LBU6OdqlnyHvPFjjOswYDuMAFRpfYQstPR0mGZZ/lW3AD5TI9hfPWg1SP/gkxPBBdM4+wCViN1tghb30780vH+tDXwcfXQgEHqUG0krYOTu+9Mf+4eYZojXfJ0Vm8lFo5c0ORUxrHlXxjgYY1LM9lcNa/bpTBAJGUfYEVSi7i4PoyXLL27MKJpDiHAU7EI3z5cgu2a8VILoSZzYEzHD9Jahj0ltzLRvKP35vlq9QUqu0CHC56WQXTda0jOHxLtsnp6HMI7Afi6brK6LJyAR6jG0vxoxUD16M67RUZ0Z/0XRPKk+ox/iWY4lMai4/ZYoMTNkpAr/znps2oAA+7yXAf9QEjWZlfga50TCVGCS+ildnxtlNJFJme4uvnJM6KRXaE664YkSKWkx3Z+v2dboU+BalmaHnjVgJ3xrIqbUi7JI8b43/cZwO2qpEhXfiXzKSvEhyFnxMa3KBizbNYZJNIlpAEij35nGOxavf/oTG7yxwsvLk0AECJV/J1pNUOza26yhtqsnhekGnomtMzrMBfUMMRJAnJpDFdFnLtyZCGKi/IyMHz4XOzAoIBAQDZ13U+R3f/bQU6wNGl4vDr++n0XRkSpWdAXrk8JOoZB8bp9wXZYPp4JXFprngOz1pVOJM5CMOCQ4WQHHGIAHRv7iuYMVHc0vco33ZlpQvuI06mDaX2ai4YMyYi6thfi6hSo17/Hg1Jx2yepmRAozQhv/euqioKkbLoaftkF5U2MhWFn/lrwlKEnq7jq/MnyKUHJB43lCxxxSAdoveTnNwaaj/wHy+hSdFkOvNBTbLMR8hcpg+wxnwHdZYd8BCXnDe70buCCq1NaeukYP6dc3Unz3BU8fMeM2XmXlr5nHSbDN+tOnVQNZ/duATmF86MJG4p1/iUkgv3A8PLEnp9km1nAoIBAQDJ7hUoEXiukPtVxqQy8INgvNViw13bFO1EHxRInMfUIG5I+vrE7ZkzzGI7fthCzpp7sTDfxjcQjJdPP9v+tMT0vnMjxcH6wbufIE2vWFdBloIG9uYSKR+U90yXAFaZYvmPPSGQMpuQpbuTjK+QTVKtYy31GhLyucZfUvSFmaTFclXw1kCbxwpfv6s4+ejZ5NEcJK61DmMcYiY50yaMF5ba4v3EnTB0SUSDTB9oE9wzlR6vXzZuz0b/LShsN8Ehi/YLaTIHgDkME+gSNfrwbShTBSIOvtudMWvjHL3bsMuDht+rQZz1ur8c3LJSxMyC3LaEo12mqcvAVmjjgGzwjT7HAoIBAGgnEZFTTlY7Y7Kxmgr8NEA/053YHTLDDljCcUIGTD7nbv1R8+P48AgdrtneZtx92yy/vfQY8pEHg4Zhcw6ZWRJjB0je28r+utk57juu68NR8jqGcAEexyce3W74ZbdY6IOKRNMpJSVPSemYmHonDbfNNri19x/ShX2FnoI+nEKrM4sN74zL/fQWgnusLLeqwOxnImNkXtOOckp5LnHPH5Upk6RU5MrypkCLxt5ELeZps6xIYVwdqhNO7xUlQGmccTFFl6cXP8Cxkc6n6VSSbUM5dPXIMHsSC/hWyJxrZ3zybMdAGfLdkK/LWdxBKanriRhMgDdYlIvnquce0J3VMqUCggEAYulSR6w3NxshYeTJbYJOeEZHJ/eWs8fOaP3oS6EwaQHxw6Hc0DWqQ6sruwTpHeBh35Dt5c8MDfkv7MvVETCvAUuAztcBq7jWFJ4YL3nQU/pLeunZzK+EHs38IEM0KDJJGBbTp/SCKxpjhWT2YnLdurzIODUrbuX8+5iA2ihmg6j729q3DxcyR7B1SJVxr7nbjDOTuHBxr+eL3etGCH1Nka56q6Jrp6pz+vSAtdR0mnfC7hhva1vw5PHTyR6OZcZPIUvIC9CNIRNnK/RxFPADPpdXFW372UXqGPdtMH2rUqPwT8z1+5AcKSEZ4F0x6DAA33u+VfL6MR6ihj3UHwiw5QKCAQA5/qLj+ARozYNhkcor2y/ZVWgFgWOQzaJ7RtxmV2h+++zm3YXciz42b2RjdBdnqq26eJV5jBlnSf1LacREhSRkKAExziIuSZya6h9bDWFJKHswP/l3mIfd7C7VSQiviO57H4O9iAWysr3fQXgDBddwum6q52WXkKiPC2aCkZDveQSeLSxyGvleRaI2uUaxKKj21PGjBWVMGs+hEvY7au4uIp6clJ0BWZiQuKrNOx8+Uer5YBMJbdmWoswY8sayjDu+o5jizUsOw7mvWCwLBTU00G2GrBPK2WxqrUR6zfcnC5KkrzHFBSYhj7Y1YVxw8p2b+gv/bfBaTLANO5ClFyvq
-----END RSA PRIVATE KEY-----`;
	const publicKeyBase64: string = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAq9TDXasqFwf729XSmIRE3+5hDiFVuPMTQUsvXVlnIJ3eukez/bydANV+25L7RV/vuZTBwxDez3JicLHG9F0L6Sa1w2max93CHT+K/jz31pUfkT++FOPl5azH63gMSvK+y4av8NJh4GHzSU3kpta8CQGAxp2G9bmGNiEqWWevYhm1mMyj5NMkmYlGTLHVALG+ejc/+hScZ1YMujIYK7Czs7LwgX2SS7Zkw9GFVDs8D5by8yqXY5aRIEWmAfmNu4q1/mb9DV2izUkLB55wb1TCnn5A1XSWgiyCS5MyocARqAamge+Pov4U9sOrppl4CRmLCcAHn9/LY4iC2+pbTx26qASR6zNm9fGuN0rDkxlUztMRwyA4vf+ISku9i1P2M8hhh399/HjgR6aFbXnZ9O64f5g+4dRytJLQT2dDJhUi1kB/pclnGAc5aOPX3SIaN6VOA+mI18pNFW86t0hCdWXzddE9HFhVVdBVLt2yF0yiaT4tS7cTJlLeyj3nWBI9l76dhQmJi1SxKNEfos/neSBOWECHCo1gZruB/NS8JctZTB0759asU6M2qO2olh9bTqNMSTgZam67ba83kaFpDQ6rJSs5K8gj7htawPaMRmKTBB8qyKuiQNwpFVRHOCxmOBiwrvKNeEV6WbphpzuNDjdjriumv4oLNgXdb1QfS+UM/RECAwEAAQ==
-----END PUBLIC KEY-----`;

	it( 'Should provide pkcs8 key data', ( done: DoneFn ) => {

		const privatePem: PemParser = new PemParser( privateKeyBase64 );

		Promise.all( [
		    expect( privatePem ).toBeDefined(),
			expect( privatePem.type ).toEqual( 'pkcs8' ),
			expect( privatePem.type ).toBeDefined()
		] ).then( () => done(), ( err: Error ) => {

			fail( err );
			done();

		} );

	} );

	it( 'Should provide spki key data', ( done: DoneFn ) => {

		const publicPem: PemParser = new PemParser( publicKeyBase64 );

		Promise.all( [
		    expect( publicPem ).toBeDefined(),
			expect( publicPem.type ).toEqual( 'spki' ),
			expect( publicPem.type ).toBeDefined()
		] ).then( () => done(), ( err: Error ) => {

			fail( err );
			done();

		} );

	} );

	it( 'Should return valid pkcs8 CryptoKey', ( done: DoneFn ) => {

		const privatePem: PemParser = new PemParser( privateKeyBase64 );

		privatePem.getCryptoKey( { name: 'RSA-OAEP', hash: 'SHA-512' }, [ 'decrypt' ] ).subscribe(
			( key: CryptoKey ) => {

			    Promise.all( [

			        expect( key ).toBeDefined(),
					expect( key ).toBeInstanceOf( CryptoKey ),
					expect( key.type ).toEqual( 'private' ),
					expect( key.algorithm.name ).toEqual( 'RSA-OAEP' )

				] ).finally( done );

			},
			( err: Error ) => {

			    fail( err );
			    done();

			}
		);

	} );

	it( 'Should return valid spki CryptoKey', ( done: DoneFn ) => {

		const privatePem: PemParser = new PemParser( publicKeyBase64 );

		privatePem.getCryptoKey( { name: 'RSA-OAEP', hash: 'SHA-512' }, [ 'encrypt' ] ).subscribe(
			( key: CryptoKey ) => {

			    Promise.all( [

					expect( key ).toBeDefined(),
					expect( key ).toBeInstanceOf( CryptoKey ),
					expect( key.type ).toEqual( 'public' ),
					expect( key.algorithm.name ).toEqual( 'RSA-OAEP' )

				] ).finally( done );

			},
			( err: Error ) => {

			    fail( err );
			    done();

			}
		);

	} );

} );
